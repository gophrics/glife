import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, ImageProgressEventDataIOS, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
import ImageDataModal from '../Modals/ImageDataModal';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';
import { StepModal } from '../Modals/StepModal';
import { TripModal } from '../Modals/TripModal';
import { TravelUtils } from '../Utilities/TravelUtils';
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
    finished: number,
    total: number
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

        this.state = {
            finished: 0,
            total: 100
        }
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
                <View style={{width: "60%", alignSelf: 'center'}}>
                {
                    Platform.OS == 'ios' ? 
                        <ProgressViewIOS progressViewStyle={'bar'} progress={this.state.finished/this.state.total}/>
                    : 
                        <ProgressBarAndroid progress={this.state.finished/this.state.total}/>
                }
                </View>
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
            this.setState({
                total: trips.length
            })
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

                    this.setState({
                        finished: asynci
                    })

                    this.dataToSendToNextPage.countriesVisited.push.apply(this.dataToSendToNextPage.countriesVisited, res.countryCode)

                    if(asynci == trips.length) {
                        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
                        this.dataToSendToNextPage.countriesVisited = x(this.dataToSendToNextPage.countriesVisited); // Removing duplicates
                        console.log(this.dataToSendToNextPage.countriesVisited)
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

    async populateTripModalData (steps: StepModal[], tripId: number) {
        var tripResult : TripModal = new TripModal();

        var homeStep = this.homesDataForClustering[Math.floor(steps[0].startTimestamp/8.64e7)-1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)
        var _stepModal = new StepModal()
        _stepModal.meanLatitude = homeStep.latitude
        _stepModal.meanLongitude = homeStep.longitude
        _stepModal.startTimestamp = homeStep.timestamp
        _stepModal.endTimestamp = homeStep.timestamp
        _stepModal.id = 0;
        _stepModal.distanceTravelled = 0;
        tripResult.tripAsSteps.push(_stepModal)
        
        var i = 0;
        var countries: string[] = []
        var places: string[] = []

        var tripName = "";
        for(var step of steps) {
            tripResult.tripAsSteps.push(step);
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
        _stepModal.distanceTravelled = Math.floor(tripResult.tripAsSteps[i-1].distanceTravelled + 
            ClusterProcessor.EarthDistance({latitude: _stepModal.meanLatitude, longitude: _stepModal.meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal))

        tripResult.tripAsSteps.push(_stepModal)
        i++;

        // Load locations
        for(var step of steps) {
            await TravelUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)
            .then((res) => {
                if(res && res.address && (res.address.county || res.address.state_district)) {
                    step.location = res.address.county || res.address.state_district
                    if(countries.indexOf(res.address.country) == -1) {
                        if(countries.length == 0) tripName = (res.address.country)
                        else tripName += (", " + res.address.country)
                        countries.push(res.address.country)
                    }
                    if(places.indexOf(step.location) == -1) {
                        places.push(step.location)
                    }
                    tripResult.countryCode.push((res.address.country_code as string).toLocaleUpperCase())
                }
            })
        }

        tripResult.tripId = tripId;
        tripResult.daysOfTravel = Math.abs(Math.floor(steps[steps.length-1].endTimestamp/8.64e7) - Math.floor(steps[0].startTimestamp/8.64e7))
        // Handling edge case
        if(tripResult.daysOfTravel == 0) tripResult.daysOfTravel = 1;
        
        tripResult.distanceTravelled = tripResult.tripAsSteps[tripResult.tripAsSteps.length - 1].distanceTravelled
        tripResult.startDate = TravelUtils.getDateFromTimestamp(steps[0].startTimestamp);
        tripResult.endDate = TravelUtils.getDateFromTimestamp(steps[steps.length-1].endTimestamp);
        tripResult.location = {
            // TODO: Fix this, country visited is not first step, first step is home
            latitude: tripResult.tripAsSteps[1].meanLatitude,
            longitude: tripResult.tripAsSteps[1].meanLongitude,
            latitudeDelta: 0,
            longitudeDelta: 0
        };

        if(countries.length == 1) {
            // Only home country, use places
            tripName = ""
            var index = 0;
            for(var place of places) {
                if(index == 0) {
                    tripName = place
                } else 
                tripName += ", " + place 
                if(index == 2) break;
                index++;
            }
        }
        tripResult.title = tripName

        return  tripResult
    }
       
}