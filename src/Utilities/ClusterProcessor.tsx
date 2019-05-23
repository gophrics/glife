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

        var dbscan = new DBSCAN(trip, 500, 1, ClusterProcessor.EarthAndTimeDistanceCombined);
        var clusterResult: ClusterModal[][] =  dbscan.Run(trip, 500, 1, ClusterProcessor.EarthAndTimeDistanceCombined);
        
        var stepResult: StepModal[] = [];

        for(var cluster of clusterResult) {
            var step: StepModal = new StepModal()
            var markers: Region[] = []
            var imageUris: string[] = []
            var latitudeSum = 0;
            var longitudeSum = 0;
            for(var clusterModal of cluster) {
                markers.push(
                {
                    latitude: clusterModal.latitude, 
                    longitude: clusterModal.longitude, 
                    latitudeDelta: 0, 
                    longitudeDelta: 0
                } as Region);
                imageUris.push(clusterModal.image);
                latitudeSum += clusterModal.latitude;
                longitudeSum += clusterModal.longitude;
            }
            step.startTimestamp = cluster[0].timestamp;
            step.endTimestamp = cluster[cluster.length-1].timestamp;
            step.imageUris = imageUris;
            step.markers = markers;
            step.meanLatitude = latitudeSum/cluster.length;
            step.meanLongitude = longitudeSum/cluster.length;
            
            stepResult.push(step);
        }
        return stepResult ;
        //Populate markers as well
    }


    static RunMasterClustering = (clusterData: Array<ClusterModal>, homes: {[key:number]: ClusterModal}) 
        : ClusterModal[][] => {
        var trips = []
        var trip = []
        for(var data of clusterData) {
            if(ClusterProcessor.EarthDistance(homes[Math.floor(data.timestamp/8.64e7)], data) > 100) {
                trip.push(data)
            } else if(trip.length > 0){
                trips.push(trip)
                trip = []
            }
        }

        return trips;
    }

    static EarthAndTimeDistanceCombined(p: ClusterModal, q: ClusterModal) {
        var earthDistance = ClusterProcessor.EarthDistance(p, q);
        var timeDistance = ClusterProcessor.TimeDistance(p, q);

        var distance = Math.sqrt(earthDistance*earthDistance + timeDistance*timeDistance);

        return distance;
    }

    static TimeDistance = (p: ClusterModal, q: ClusterModal) => {
        if(p == undefined || q == undefined) return 0; // TODO: Need to find out this case
        return p.timestamp - q.timestamp
    }

    static EarthDistance = (p: ClusterModal, q: ClusterModal) => {
        if(p == undefined || q == undefined) return 0;
        var R = 6371;
        var dLat = ClusterProcessor.deg2rad(p.latitude-q.latitude); 
        var dLon = ClusterProcessor.deg2rad(p.longitude-q.longitude); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(ClusterProcessor.deg2rad(p.latitude)) * Math.cos(ClusterProcessor.deg2rad(p.longitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km

        return d;
    }

    static deg2rad = (deg: number) => {
        return deg * (Math.PI/180)
    }
}