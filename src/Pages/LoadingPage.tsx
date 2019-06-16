import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, PermissionsAndroid, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
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
import ImageDataModal from '../Modals/ImageDataModal';

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
    setNavigator: any,
    setPage: any
}

interface IState {
    finished: number,
    total: number
}



export default class LoadingPage extends React.Component<IProps, IState> {

    dataToSendToNextPage: MapPhotoPageModal = new MapPhotoPageModal([]);
    homes: {latitude: number, longitude: number, timestamp: number}[]  = []
    myData: any
    retryCount = 20;

    homesDataForClustering: {[key:number]: ClusterModal} = {}

    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
        var data: MapPhotoPageModal = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        data.trips = []
        data.countriesVisited = [];
        data.percentageWorldTravelled = 0;
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], data)
        this.state = {
            finished: 0,
            total: 100
        }

        this.loadHomes();
    }

    requestPermissionAndroid = async() : Promise<boolean> => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Cool Photo App Camera Permission',
                message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use read from the storage")
                return true;
            } else {
              console.log("Storage permission denied")
              return false
            }
          } catch (err) {
            console.warn(err)
            return false
          }
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
                    if(i == this.myData.length) {
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
                        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.NEWTRIP], this.homesDataForClustering); 
                        this.initialize(endTimestamp);
                    } 
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
                        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={this.state.finished/this.state.total}/>
                }
                </View>
            </View>
        );
    }



    // Helper methods
    initialize  = async(endTimestamp: number) => {

        if(Platform.OS == "android") await this.requestPermissionAndroid()
        else if(Platform.OS == "ios") await PhotoLibraryProcessor.checkPhotoPermission()
        if(!(await PhotoLibraryProcessor.checkPhotoPermission())) {
            this.props.setPage(Page[Page.NOPERMISSIONIOS])
            return;
        }
        
        var photoRollInfos: ImageDataModal[] = await PhotoLibraryProcessor.getPhotosFromLibrary();

        // Create a No photos found warning page
        if(photoRollInfos.length == 0) {
            this.props.setPage(Page[Page.PROFILE])
        }

        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(photoRollInfos, endTimestamp)
        var trips = ClusterProcessor.RunMasterClustering(clusterData, this.homesDataForClustering);

        console.log(trips.length)
        if(trips.length == 0) {
            this.props.setPage(Page[Page.PROFILE])
            return;
        }
        
        this.setState({
            total: trips.length
        })

        var asynci = 0;
        for(var i = 0; i < trips.length; i++){

            try {
                var trip = trips[i]

                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp-b.timestamp
                });
                
                var _steps: StepModal[] = ClusterProcessor.RunStepClustering(trip);
                var _trip: TripModal = await LoadingPage.PopulateTripModalData(_steps, TravelUtils.GenerateTripId());
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
                    this.props.setPage(Page[Page.PROFILE], this.dataToSendToNextPage);
                }
            } catch(err) {
                i--;
            }
        }
    }

    static UpdateProfileDataWithTrip (profileData: MapPhotoPageModal, trip: TripModal) : MapPhotoPageModal {

        profileData.countriesVisited.push.apply(profileData.countriesVisited, trip.countryCode)
        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        profileData.countriesVisited = x(profileData.countriesVisited); // Removing duplicates
        profileData.percentageWorldTravelled = Math.floor(profileData.countriesVisited.length*100/186)

        var trips: TripModal[] = []
        for(var _trip of profileData.trips) {
            if(_trip.tripId == trip.tripId){ trips.push(trip); continue; }
            trips.push(_trip)
        }

        profileData.trips = trips

        return profileData
    }

    static async PopulateTripModalData (steps: StepModal[], tripId: number) {
        var tripResult : TripModal = new TripModal();
        var homesDataForClustering = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP])

        var homeStep = homesDataForClustering[Math.floor(steps[0].startTimestamp/8.64e7)-1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)

        var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
        _stepModal.location = "Home";
        _stepModal.id = 0;
        tripResult.tripAsSteps.push(_stepModal)
        
        var i = 0;
        var countries: string[] = []
        var places: string[] = []

        for(var step of steps) {
            step.distanceTravelled = Math.floor(tripResult.tripAsSteps[i].distanceTravelled + 
                ClusterProcessor.EarthDistance({latitude: step.meanLatitude, longitude: step.meanLongitude} as ClusterModal,
                {latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal))
            tripResult.tripAsSteps.push(step);
            i++;
        }

        var homeStep2 = homesDataForClustering[Math.floor(steps[steps.length-1].endTimestamp/8.64e7)+1]
        homeStep2.timestamp = Math.floor(steps[steps.length-1].endTimestamp + 8.64e7)

        var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
        _stepModal2.location = "Home";
        _stepModal2.distanceTravelled = Math.floor(tripResult.tripAsSteps[i].distanceTravelled + 
            ClusterProcessor.EarthDistance({latitude: _stepModal.meanLatitude, longitude: _stepModal.meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal))
        _stepModal2.id = 10000

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