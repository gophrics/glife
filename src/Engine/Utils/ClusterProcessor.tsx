import { ClusterModal } from "../Modals/ClusterModal";
import { StepModal } from "../Modals/StepModal";
import Region from "../Modals/Region";
import { PublisherSubscriber } from "../PublisherSubscriber";

export class ClusterProcessor {

    
    static RunStepClustering = async(trip: ClusterModal[]) : Promise<StepModal[]> => {
        
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
            var _step = ClusterProcessor.convertClusterToStep(cluster)
            if(_step.stepId != -1) stepResult.push(_step)
        }

        stepResult.sort((a, b) => {
            return a.endTimestamp - b.endTimestamp;
        })

        var i = 100;
        var previousStep: StepModal = new StepModal();
        var distanceTravelled = 0
        for(var step of stepResult) {
            step.stepId = i
            if(i > 100)
            distanceTravelled += Math.floor(ClusterProcessor.EarthDistance({ latitude: step.meanLatitude, longitude: step.meanLongitude } as ClusterModal,
                { latitude: previousStep.meanLatitude, longitude: previousStep.meanLongitude } as ClusterModal))
            step.distanceTravelled = distanceTravelled;
            step.description = "Description goes here..."
            i+= 100;
            previousStep = step;
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
            // If distance from home is more than 40 km
            if(ClusterProcessor.EarthDistance(homes[Math.floor(data.timestamp/8.64e7)], data) > 40
            // Noise filtering, if two pictures are taken 7 days apart, consider it a new trip
            && (ClusterProcessor.TimeDistance(data, prevData) < 8.64e7*7)) {
                trip.push(data)
            } else if(trip.length > 0){
                // If more than 3 photo were taken for the trip, it's officially considered a trip
                if(trip.length > 3)
                    trips.push(trip)
                trip = []
            }
            prevData = data
        }

        if(trip.length > 0) trips.push(trip)
        console.log(trips)
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

    static convertClusterToStep = (cluster: ClusterModal[]) : StepModal => {
        if(cluster.length == 0){
            var _step = new StepModal();
            _step.stepId = -1;
            return _step;   
        }

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
            if(item.image)
            PublisherSubscriber.ImageBus = item.image
            imageUris.push(item.image);
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
        _step.masterMarker = new Region(_step.meanLatitude, _step.meanLongitude, 0, 0);


        return _step;
    }


    static deg2rad = (deg: number) => {
        return deg * (Math.PI/180)
    }
}