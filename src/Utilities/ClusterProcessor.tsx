import { ClusterModal } from "../Modals/ClusterModal";
import { StepModal } from "../Modals/StepModal";
import { DBSCAN } from "./DBSCAN";
import Region from "../Modals/Region";

export class ClusterProcessor {

    /*
        homes = [list of homes with time]
        while(true){ 
            p = inital point + 1
            p' = p
            trip = []
            while(p' away from home by more than 100km) {
                trip = trip.push(p')
                p' = p' + 1
            }
        }
    */

    // homes; key - timestamp by date, value - lat, long
    // homes expanded to match clusterData size

    static RunStepClustering = (trip: ClusterModal[]) : StepModal[] => {
        
        if(trip.length == 0) throw "Recieved empty tripcluster";

        trip.sort((a, b) => {
            return a.timestamp-b.timestamp;
        })
        var stepResult: StepModal[] = []

        var firstTimestamp = trip[0].timestamp;
        var _stepCluster: ClusterModal[][] = []
        _stepCluster.push([])
        var _it = 0

        for(var item of trip) {
            if(item.timestamp <= firstTimestamp + 8.64e7)
                _stepCluster[_it].push(item)
            else {
                firstTimestamp += 8.64e7
                _stepCluster.push([])
                _it++;
            }
        }

        for(var cluster of _stepCluster) {

            if(cluster.length == 0) continue

            var latitudeSum = 0;
            var longitudeSum = 0;
            var imageUris: string[] = [] 
            var markers: Region[] = []

            cluster.sort((a, b) => {
                return a.timestamp-b.timestamp;
            })

            for(var item of cluster) {
                latitudeSum += item.latitude;
                longitudeSum += item.longitude;
                imageUris.push(item.image)
                markers.push(new Region(item.latitude, item.longitude, 0, 0))
            }

            var _step: StepModal = new StepModal()
            _step.meanLatitude = latitudeSum/cluster.length;
            _step.meanLongitude = longitudeSum/cluster.length;
            _step.markers = markers;
            _step.startTimestamp = cluster[0].timestamp;
            _step.endTimestamp = cluster[cluster.length - 1].timestamp
            _step.imageUris = imageUris

            stepResult.push(_step)
        }
        console.log("Step clustering result")
        console.log(stepResult)

        return stepResult ;
    }


    static RunMasterClustering = (clusterData: Array<ClusterModal>, homes: {[key:number]: ClusterModal}) : ClusterModal[][] => {
       
        var trips = []
        var trip = []
        
        clusterData.sort((a, b) => {
            return a.timestamp-b.timestamp
        })
        
        for(var data of clusterData) {
            if(ClusterProcessor.EarthDistance(homes[Math.floor(data.timestamp/8.64e7)], data) > 100) {
                trip.push(data)
            } else if(trip.length > 0){
                // If more than 10 photos were taken for the trip
                if(trip.length > 10)
                    trips.push(trip)
                trip = []
            }
        }

        if(trip.length > 0) trips.push(trip)
        return trips;
    }

    static TimeDistance = (p: ClusterModal, q: ClusterModal) => {
        if(p == undefined || q == undefined) return 0; // TODO: Need to find out this case
        return p.timestamp - q.timestamp
    }

    static EarthDistance = (p: ClusterModal, q: ClusterModal) => {
        if(p == undefined || q == undefined) return 0;
        var lat2 = q.latitude;
        var lat1 = p.latitude;
        var lon2 = q.longitude;
        var lon1 = p.longitude;

        var R = 6371; // km
        var dLat = ClusterProcessor.deg2rad(lat2 - lat1);
        var dLon = ClusterProcessor.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(ClusterProcessor.deg2rad(lat1)) * Math.cos(ClusterProcessor.deg2rad(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    static deg2rad = (deg: number) => {
        return deg * (Math.PI/180)
    }
}