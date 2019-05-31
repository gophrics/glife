import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, ImageProgressEventDataIOS } from 'react-native';
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
import AsyncStorage from '@react-native-community/async-storage';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';

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
        color:'black'
    }
});

interface IProps {
    onDone: (data: any) => void,
    setNavigator: any
}

interface IState {

}

export default class LoadingPage extends React.Component<IProps, IState> {

    dataToSendToNextPage: MapPhotoPageModal = new MapPhotoPageModal([]);
    homesDataForClustering: {[key:number]: ClusterModal} = {}
    homes: ClusterModal[]  = []
    myData: any
    retryCount = 20;
    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
        var i = 0;
        for(var element of this.myData) {
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
                if(i == this.myData.length) this.initialize();
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
            // TODAY
            this.homesDataForClustering[endTimestamp+1] = this.homes[this.homes.length-1]

            BlobSaveAndLoad.Instance.setBlobValue(Page[Page.NEWTRIP], this.homesDataForClustering); 

            var trips = ClusterProcessor.RunMasterClustering(clusterData, this.homesDataForClustering);

            i = 0;
            var asynci = 0;
            for(var trip of trips) {
                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp-b.timestamp
                });
                
                this.populateTripModalData(ClusterProcessor.RunStepClustering(trip), i)
                .then((res) => {
                    this.dataToSendToNextPage.trips.push(res);
                    asynci++;
                    if(this.dataToSendToNextPage.countriesVisited.indexOf(res.countryCode) == -1)
                        this.dataToSendToNextPage.countriesVisited.push(res.countryCode)

                    if(asynci == trips.length) {
                        this.dataToSendToNextPage.percentageWorldTravelled = Math.floor(this.dataToSendToNextPage.countriesVisited.length*100/186)
                        this.dataToSendToNextPage.trips.sort((a, b) => {
                            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                        })
                        for(var i = 0; i < this.dataToSendToNextPage.trips.length; i++) this.dataToSendToNextPage.trips[i].tripId = i;
                        this.props.onDone(this.dataToSendToNextPage);
                    }
                })
                i++;
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

        }

        homeStep = this.homesDataForClustering[Math.floor(steps[steps.length-1].endTimestamp/8.64e7)+1]
        homeStep.timestamp = Math.floor(steps[steps.length-1].endTimestamp + 8.64e7)

        var _stepModal = new StepModal()
        _stepModal.meanLatitude = homeStep.latitude
        _stepModal.meanLongitude = homeStep.longitude
        _stepModal.startTimestamp = homeStep.timestamp
        _stepModal.endTimestamp = homeStep.timestamp
        _stepModal.id = (tripResult.tripAsSteps.length+1)*100
        tripResult.tripAsSteps.push(_stepModal)
        i++;
        distanceTravelled += ClusterProcessor.EarthDistance({latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal)


        tripResult.tripId = tripId;
        tripResult.daysOfTravel = Math.abs(Math.floor(steps[steps.length-1].endTimestamp/8.64e7) - Math.floor(steps[0].startTimestamp/8.64e7))
        // Handling edge case
        if(tripResult.daysOfTravel == 0) tripResult.daysOfTravel = 1;
        
        tripResult.distanceTravelled = Math.floor(distanceTravelled)
        tripResult.startDate = TravelUtils.getDateFromTimestamp(steps[0].startTimestamp);
        tripResult.endDate = TravelUtils.getDateFromTimestamp(steps[steps.length-1].endTimestamp);
        tripResult.location = {
            // TODO: Fix this, country visited is not first step, first step is home
            latitude: tripResult.tripAsSteps[1].meanLatitude,
            longitude: tripResult.tripAsSteps[1].meanLongitude,
            latitudeDelta: 0,
            longitudeDelta: 0
        };

        return  TravelUtils.getLocationFromCoordinates(tripResult.location.latitude, tripResult.location.longitude)
                .then((res) => {
                    if(!res.address) { return; }
                    tripResult.title = res.address.country
                    tripResult.countryCode = (res.address.country_code as string).toLocaleUpperCase()
                })
                .then(() => {
                    return tripResult;
                })
    }
       
}