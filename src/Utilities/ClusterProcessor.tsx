import { ClusterModal } from "../Modals/ClusterModal";
import { StepModal } from "../Modals/StepModal";
import { DBSCAN } from "./DBSCAN";

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

        var dbscan = new DBSCAN(trip, 0, 1, ClusterProcessor.EarthAndTimeDistanceCombined);
        dbscan.Run(trip, 0, 1, ClusterProcessor.EarthAndTimeDistanceCombined);
        //Populate markers as well
        return [new StepModal()];
    }


    static RunMasterClustering = (clusterData: Array<ClusterModal>, homes: {[key:number]: ClusterModal}) 
        : ClusterModal[][] => {
        var trips = []
        var trip = []
        for(var data of clusterData) {
            if(ClusterProcessor.EarthDistance(homes[Math.floor(data.timestamp/8.64e7)], data) > 100) {
                trip.push(data)
            } else {
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
        return p.timestamp - q.timestamp
    }

    static EarthDistance = (p: ClusterModal, q: ClusterModal) => {
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