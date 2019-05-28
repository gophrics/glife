import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, AsyncStorage, ImageProgressEventDataIOS } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
import ImageDataModal from '../Modals/ImageDataModal';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';
import { StepModal } from '../Modals/StepModal';
import { TripModal } from '../Modals/TripModal';
import { TravelUtils } from '../Utilities/TravelUtils';
import { ProfileModalInstance } from '../Modals/ProfileModalSingleton';

interface Styles {
    spinnerContainer: ViewStyle,
    infoText: TextStyle
};

var styles = StyleSheet.create<Styles>({
    spinnerContainer: {
        flex: 5,
        alignSelf: 'center'
    },
    infoText: {
        flex: 9,
        padding: '20%',
        alignSelf: 'center',
        color:'white'
    }
});

interface IProps {
    onDone: (data: any) => void,
    homes: { name: string, timestamp: number }[]
}

interface IState {

}

export default class LoadingPage extends React.Component<IProps, IState> {

    dataToSendToNextPage: MapPhotoPageModal = new MapPhotoPageModal([]);
    homesDataForClustering: {[key:number]: ClusterModal} = {}
    homes: ClusterModal[]  = []

    retryCount = 20;
    constructor(props:any) {
        super(props);

        var i = 0;
        for(var element of this.props.homes) {
            TravelUtils.getCoordinatesFromLocation(element.name)
            .then((res) => {
                if(res.length <= 0) return;
                // Taking first home only, when multiple places can have same name
                // Fix this bug, TODO:
                res = res[0];
                this.homes.push({
                    latitude: Number.parseFloat(res.lat),
                    longitude: Number.parseFloat(res.lon),
                    timestamp: element.timestamp
                } as ClusterModal)

                i++;
                if(i == this.props.homes.length) this.initialize();
            })
        }
    }

    render() {
        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={styles.spinnerContainer}>
                    <Spinner/>
                </View>
            </View>
        );
    }

    // Helper methods
    initialize () {
        console.log(this.homes)
        PhotoLibraryProcessor.getPhotosFromLibrary()
        .then((photoRollInfos: Array<ImageDataModal>) => {
    
            var markers = PhotoLibraryProcessor.getMarkers(photoRollInfos);
            var timelineData: Array<number> = PhotoLibraryProcessor.getTimelineData(photoRollInfos);

            var clusterData: Array<ClusterModal> = [];
            for(var i = 0; i < markers.length; i++) {
                clusterData.push({
                    image: photoRollInfos[i].image,
                    latitude: markers[i].latitude, 
                    longitude: markers[i].longitude, 
                    timestamp: timelineData[i],
                    id: i} as ClusterModal )
            }

            // Expanding homes to timestamp
            var initialTimestamp = 0;
            var endTimestamp = 0;
            for(var data in this.homes) {
                endTimestamp = Math.floor(this.homes[data].timestamp/8.64e7)
                if(Number.isNaN(endTimestamp)) //Current day
                    endTimestamp = Math.floor((new Date()).getTime()/8.64e7)
                for(var i = initialTimestamp; i <= endTimestamp; i++) {
                    this.homesDataForClustering[i] = this.homes[data]
                    // For some reason this is not working. To be checked later
                    this.homesDataForClustering[i].timestamp = i*8.64e7
                }
                initialTimestamp = endTimestamp;
            }

            var trips = ClusterProcessor.RunMasterClustering(clusterData, this.homesDataForClustering);

            i = 0;
            for(var trip of trips) {
                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp-b.timestamp
                });
                
                var _trip: TripModal = this.populateTripModalData(ClusterProcessor.RunStepClustering(trip), i)
                this.dataToSendToNextPage.trips.push(_trip);
                i++;
                console.log(_trip)
            }

            this.props.onDone(this.dataToSendToNextPage);
        });
    }

    getLocation(latitude: number, longitude: number) {
        if(this.retryCount == 0) return;
        this.retryCount--
        TravelUtils.getLocationFromCoordinates(latitude, longitude)
        .then((res) => {
            if(res.address) {
                res = res.address.country
                if(ProfileModalInstance.countriesVisited.indexOf(res) == -1) {
                    ProfileModalInstance.countriesVisited.push(res);
                }
                ProfileModalInstance.percentageWorldTravelled = Math.floor((ProfileModalInstance.countriesVisited.length)*100/186)
            } else {
                this.getLocation(latitude, longitude)
            }
        })
    }

    populateTripModalData = (steps: StepModal[], tripId: number) => {
        var tripResult : TripModal = new TripModal();
        var distanceTravelled = 0;

        var homeStep = this.homesDataForClustering[Math.floor(steps[0].startTimestamp/8.64e7)-1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)
        var _stepModal = new StepModal()
        _stepModal.meanLatitude = homeStep.latitude
        _stepModal.meanLongitude = homeStep.longitude
        _stepModal.startTimestamp = homeStep.timestamp
        _stepModal.endTimestamp = homeStep.timestamp
        _stepModal.id = 0;
        tripResult.tripAsSteps.push(_stepModal)

        var i = 0;
        for(var step of steps) {
            tripResult.tripAsSteps.push(step);

            if(i > 0)
            distanceTravelled += ClusterProcessor.EarthDistance({latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal,
                                {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal)
            i++;

            this.getLocation(step.meanLatitude, step.meanLongitude)
        }

        homeStep = this.homesDataForClustering[Math.floor(steps[steps.length-1].endTimestamp/8.64e7)+1]
        homeStep.timestamp = Math.floor(steps[steps.length-1].endTimestamp + 8.64e7)
        var _stepModal = new StepModal()
        _stepModal.meanLatitude = homeStep.latitude
        _stepModal.meanLongitude = homeStep.longitude
        _stepModal.startTimestamp = homeStep.timestamp
        _stepModal.endTimestamp = homeStep.timestamp
        _stepModal.id = tripResult.tripAsSteps.length
        tripResult.tripAsSteps.push(_stepModal)
        i++;
        distanceTravelled += ClusterProcessor.EarthDistance({latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal)


        tripResult.tripId = tripId;
        tripResult.daysOfTravel = Math.floor(Math.abs(steps[steps.length-1].endTimestamp - steps[0].startTimestamp)/8.64e7)
        tripResult.distanceTravelled = Math.floor(distanceTravelled)
        tripResult.startDate = TravelUtils.getDateFromTimestamp(steps[0].startTimestamp);
        tripResult.endDate = TravelUtils.getDateFromTimestamp(steps[steps.length-1].endTimestamp);
        tripResult.location = {
            latitude: steps[0].meanLatitude,
            longitude: steps[0].meanLongitude,
            latitudeDelta: 0,
            longitudeDelta: 0
        };

        return tripResult;
    }
       
}