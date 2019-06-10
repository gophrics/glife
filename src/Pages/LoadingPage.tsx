import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, ImageProgressEventDataIOS, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
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
        fontFamily: 'AppleSDGothicNeo-Regular',
        fontSize: 28,
        textAlign: 'center',
        padding: '20%',
        alignSelf: 'center',
        color:'white'
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
    homes: {latitude: number, longitude: number, timestamp: number}[]  = []
    myData: any
    retryCount = 20;
    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], {})
        this.state = {
            finished: 0,
            total: 100
        }

        this.loadHomes();
    }

    loadHomes = async() => {
        var i = 0;
        for(var element of this.myData) {
            await TravelUtils.getCoordinatesFromLocation(element.name)
                .then((res) => {
                    if(res.length <= 0) return;

                    res = res[0];
                    this.homes.push({
                        latitude: Number.parseFloat(res.lat),
                        longitude: Number.parseFloat(res.lon),
                        timestamp: (element.timestamp as number)
                    })
                    i++;
                    if(i == this.myData.length) this.initialize();
                })
        }
    }

    render() {
        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <Text style={{fontSize: 16, textAlign:'center', padding: 20, color:"white"}}>Make sure you don't close the app, and phone doesn't get locked</Text>
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
    initialize  = async() => {

        // Expanding homes to timestamp
        var endTimestamp = Math.ceil((new Date()).getTime()/8.64e7);
        this.homes.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })

        for(var data of this.homes) {
            while(endTimestamp >= Math.floor(data.timestamp/8.64e7) && endTimestamp >= 0) {
                this.homesDataForClustering[endTimestamp] = data as ClusterModal;
                endTimestamp--;
            }
        }

        var photoRollInfos = await PhotoLibraryProcessor.getPhotosFromLibrary();
        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(photoRollInfos, endTimestamp)

        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.NEWTRIP], this.homesDataForClustering); 

        var trips = ClusterProcessor.RunMasterClustering(clusterData, this.homesDataForClustering);
        this.setState({
            total: trips.length
        })

        var asynci = 0;
        for(var trip of trips) {
            trip.sort((a: ClusterModal, b: ClusterModal) => {
                return a.timestamp-b.timestamp
            });
            
            var _steps: StepModal[] = ClusterProcessor.RunStepClustering(trip);
            var _trip: TripModal = await this.populateTripModalData(_steps, asynci);
            this.dataToSendToNextPage.trips.push(_trip);


            this.setState({
                finished: asynci
            })

            this.dataToSendToNextPage.countriesVisited.push.apply(this.dataToSendToNextPage.countriesVisited, _trip.countryCode)

            asynci++;
            if(asynci == trips.length) {
                let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
                this.dataToSendToNextPage.countriesVisited = x(this.dataToSendToNextPage.countriesVisited); // Removing duplicates
                this.dataToSendToNextPage.percentageWorldTravelled = Math.floor(this.dataToSendToNextPage.countriesVisited.length*100/186)
                this.dataToSendToNextPage.trips.sort((a, b) => {
                    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                })
                for(var i = 0; i < this.dataToSendToNextPage.trips.length; i++) this.dataToSendToNextPage.trips[i].tripId = i;
                this.dataToSendToNextPage.coverPicURL = "https://cms.hostelworld.com/hwblog/wp-content/uploads/sites/2/2017/08/girlgoneabroad.jpg"
                this.dataToSendToNextPage.profilePicURL = "https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg"
                this.props.onDone(this.dataToSendToNextPage);
            }
        }
    }

    async populateTripModalData (steps: StepModal[], tripId: number) {
        var tripResult : TripModal = new TripModal();

        var homeStep = this.homesDataForClustering[Math.floor(steps[0].startTimestamp/8.64e7)-1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)
        var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
        _stepModal.location = "Home";
        tripResult.tripAsSteps.push(_stepModal)
        
        var i = 0;
        var countries: string[] = []
        var places: string[] = []

        for(var step of steps) {
            if(i > 0)
            step.distanceTravelled = Math.floor(tripResult.tripAsSteps[i-1].distanceTravelled + 
                ClusterProcessor.EarthDistance({latitude: step.meanLatitude, longitude: step.meanLongitude} as ClusterModal,
                {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal))
            tripResult.tripAsSteps.push(step);
            i++;
        }

        var homeStep2 = this.homesDataForClustering[Math.floor(steps[steps.length-1].endTimestamp/8.64e7)+1]
        homeStep2.timestamp = Math.floor(steps[steps.length-1].endTimestamp + 8.64e7)

        var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
        _stepModal2.location = "Home";
        _stepModal2.distanceTravelled = Math.floor(tripResult.tripAsSteps[i-1].distanceTravelled + 
            ClusterProcessor.EarthDistance({latitude: _stepModal.meanLatitude, longitude: _stepModal.meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i-1].meanLatitude, longitude: tripResult.tripAsSteps[i-1].meanLongitude} as ClusterModal))

        tripResult.tripAsSteps.push(_stepModal2)

        // Load locations
        for(var step of steps) {
            var result = await TravelUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)
            
            if(result && result.address && (result.address.county || result.address.state_district)) {
                step.location = result.address.county || result.address.state_district
                
                if(countries.indexOf(result.address.country) == -1) {
                    countries.push(result.address.country)
                }
                if(places.indexOf(step.location) == -1) {
                    places.push(step.location)
                }
                tripResult.countryCode.push((result.address.country_code as string).toLocaleUpperCase())
            }

            // Showing current weather now
            result = await TravelUtils.getWeatherFromCoordinates(step.meanLatitude, step.meanLongitude)
            if(result && result.main) {
                if(step.location == "" ) {
                    step.location = result.name
                    places.push(step.location)
                }
                step.temperature = Math.floor(Number.parseFloat(result.main.temp)-273.15) + "ºC"
            }
        }

        tripResult.tripId = tripId;
        tripResult.populateAll();
        tripResult.populateTitle(countries, places);

        return  tripResult
    }      
}