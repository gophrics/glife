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

    // Assumes trip: ClusterModal[][] is sorted
    static RunStepClustering = (trip: ClusterModal[]) : StepModal[] => {
        
        if(trip.length == 0) throw "Recieved empty tripcluster";

        var stepResult: StepModal[] = []

        var firstTimestamp = trip[0].timestamp;
        var firstItem = trip[0]
        var _stepCluster: ClusterModal[][] = []
        _stepCluster.push([])
        var _it = 0

        for(var item of trip) {
            // If distance between two modals are less than 10 km
            if(ClusterProcessor.EarthDistance(item, firstItem) < 10) {
                // We divide based on time
                if(item.timestamp <= firstTimestamp + 8.64e7)
                    _stepCluster[_it].push(item)
                else {
                    firstTimestamp = item.timestamp
                    _stepCluster.push([item])
                    _it++;
                }
            } else {
                // Else we divide based on distance
                firstTimestamp = item.timestamp
                firstItem = item;
                _stepCluster.push([item])
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
            _step.masterImageUri = imageUris[0];
            _step.masterMarker = markers[0];

            stepResult.push(_step)
        }

        return stepResult;
    }


    static RunMasterClustering = (clusterData: Array<ClusterModal>, homes: {[key:number]: ClusterModal}) : ClusterModal[][] => {
       
        var trips = []
        var trip = []
        
        clusterData.sort((a, b) => {
            return a.timestamp-b.timestamp
        })
        
        var prevData: ClusterModal = clusterData[0];
        for(var data of clusterData) {
            // If distance from home is more than 100 km
            if(ClusterProcessor.EarthDistance(homes[Math.floor(data.timestamp/8.64e7)], data) > 40
            // Noise filtering, if two pictures are taken 10 days apart, consider it a new trip
            && (ClusterProcessor.TimeDistance(data, prevData) < 8.64e7*10)) {
                trip.push(data)
            } else if(trip.length > 0){
                // If more than 10 photos were taken for the trip
                if(trip.length > 10)
                    trips.push(trip)
                trip = []
            }
            prevData = data
        }

        if(trip.length > 0) trips.push(trip)
        return trips;
    }

    static TimeDistance = (p: ClusterModal, q: ClusterModal) => {
        if(p == undefined || q == undefined) return 0; // TODO: Need to find out this case
        return Math.abs(p.timestamp - q.timestamp)
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