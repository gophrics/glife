import { PublisherSubscriber } from './PublisherSubscriber'
import { ProfileModal } from './Modals/ProfileModal';
import { ImageDataModal } from './Modals/ImageDataModal'
import { BlobProvider } from './Providers/BlobProvider';
import { Page, HomeDataModal } from '../Modals/ApplicationEnums';
import * as PhotoLibraryProcessor from './Utils/PhotoLibraryProcessor';
import { ClusterProcessor } from './Utils/ClusterProcessor';
import { TripModal } from './Modals/TripModal';
import { TripUtils } from './Utils/TripUtils';
import { ClusterModal } from './Modals/ClusterModal';
import { StepModal } from './Modals/StepModal';
import { BackgroundSyncProvider } from './Providers/BackgroundSyncProvider';

export enum EngineLoadStatus{
    None = 0,
    Partial = 1,
    Full = 2
}

export class Engine {
    BlobProvider: BlobProvider;
    Modal: ProfileModal
    BackgroundProcess: BackgroundSyncProvider;
    homeData: Array<HomeDataModal> = [];
    homesForDataClustering: {[key: number]: ClusterModal } = {};
    startTimestamp: any = 0;
    endTimestamp: any = 0;
    engineLoaded: EngineLoadStatus = EngineLoadStatus.None;
    
    constructor () {
        this.BlobProvider = new BlobProvider()
        this.Modal = new ProfileModal()
        this.TryLoadingProfile()
        this.TryLoadingEngineData()
        this.BackgroundProcess = new BackgroundSyncProvider()
    }

    SaveEngineData = () => {
        this.BlobProvider.homeData = this.homeData;
        this.BlobProvider.homesForDataClustering = this.homesForDataClustering;
        this.BlobProvider.startTimestamp = this.startTimestamp;
        this.BlobProvider.endTimestamp = this.endTimestamp;
    }

    Save = () => {
        this.BlobProvider.setBlobValue(Page[Page.PROFILE], this.Modal)
    }

    setName = (name: string) => {
        this.Modal.name = name;
        this.BlobProvider.setBlobValue(Page[Page.PROFILE], this.Modal)
    }

    TryLoadingProfile = () => {
        if(this.BlobProvider.blobLoaded) {
            var data = this.BlobProvider.getBlobValue(Page[Page.PROFILE])
            if(data != undefined)
                this.Modal.CopyConstructor(data)
            if(this.engineLoaded == EngineLoadStatus.None) this.engineLoaded = EngineLoadStatus.Partial
            else this.engineLoaded = EngineLoadStatus.Full
        } else {
            setTimeout(this.TryLoadingProfile, 1000)
        }
    }

    TryLoadingEngineData = () => {
        if(this.BlobProvider.engineBlobLoaded) {
            console.log(this.BlobProvider)
            this.homeData = this.BlobProvider.homeData;
            if(this.homeData) {
                this.homeData.push({
                    name: "",
                    timestamp: 0
                  } as HomeDataModal)
            }
            this.endTimestamp = this.BlobProvider.endTimestamp;
            this.startTimestamp = this.BlobProvider.startTimestamp;
            if(this.engineLoaded == EngineLoadStatus.None) this.engineLoaded = EngineLoadStatus.Partial
            else this.engineLoaded = EngineLoadStatus.Full
        } else {
            setTimeout(this.TryLoadingEngineData, 1000)
        }
    }

    SetHomeData = (homeData: Array<HomeDataModal>) => {
        this.homeData = homeData
    }

    Initialize  = async() : Promise<boolean> => {
        
        PublisherSubscriber.PauseUpdate = true;
        var photoRollInfos: ImageDataModal[] = await PhotoLibraryProcessor.getPhotosFromLibrary();

        var data = await TripUtils.GenerateHomeData(this.homeData)
        this.homesForDataClustering = data["homeData"]
        this.startTimestamp = data["startTimestamp"]
        this.endTimestamp = data["endTimestamp"]

        // Create a No photos found warning page
        if(photoRollInfos.length == 0) {
            return true
        }
        
        try {
            var trips = await this.GenerateTripFromPhotos(photoRollInfos)
            this.ClearAndUpdateProfileDataWithAllTrips(trips)
        } catch (error) {
            console.warn(error)
            PublisherSubscriber.PauseUpdate = false;
            this.Save()
            return true;
        }
        this.Save()
        PublisherSubscriber.PauseUpdate = false;
        return true
    }


    GenerateTripFromPhotos = async (imageData: ImageDataModal[]): Promise<TripModal[]> => {
        var homesDataForClustering = this.homesForDataClustering
        var endTimestamp = this.endTimestamp

        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(imageData, endTimestamp)
        var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);

        var tripResult: TripModal[] = [];

        if (trips.length == 0) throw "Not enough photos"

        TripUtils.TOTAL_TO_LOAD = trips.length;

        let asynci = 0;
        for (var i = 0; i < trips.length; i++) {

            try {
                console.log(asynci)
                var trip = trips[i]

                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp - b.timestamp
                });

                var _steps: StepModal[] = await ClusterProcessor.RunStepClustering(trip);
                var _trip: TripModal = await this.PopulateTripModalData(_steps, TripUtils.GenerateTripId());

                tripResult.push(_trip)

                asynci++;

                TripUtils.FINISHED_LOADING = asynci

                if (asynci == trips.length) {
                    tripResult.sort((a, b) => {
                        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                    })
                }
            } catch (err) {
                console.log(err)
                i--;
            }
        }

        return tripResult;
    }

    ClearAndUpdateProfileDataWithAllTrips = (trips: TripModal[]) => {
        for(var trip of trips)
            this.Modal.countriesVisited.push.apply(this.Modal.countriesVisited, trip.countryCode)

        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        this.Modal.countriesVisited = x(this.Modal.countriesVisited); // Removing duplicates
        this.Modal.percentageWorldTravelled = Math.floor(this.Modal.countriesVisited.length*100/186)
        this.Modal.trips = trips
        this.Modal.trips.sort((a: TripModal, b: TripModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })
    }


    async PopulateTripModalData(steps: StepModal[], tripId: string) {
        var tripResult: TripModal = new TripModal();
        var homesDataForClustering = this.homesForDataClustering

        var homeStep = homesDataForClustering[Math.floor(steps[0].startTimestamp / 8.64e7) - 1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)

        var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
        _stepModal.location = "Home";
        _stepModal.stepId = 0;
        tripResult.steps.push(_stepModal)

        var i = 0;
        var countries: string[] = []
        var places: string[] = []

        for (var step of steps) {
            step.distanceTravelled = Math.floor(tripResult.steps[i].distanceTravelled +
                ClusterProcessor.EarthDistance({ latitude: step.meanLatitude, longitude: step.meanLongitude } as ClusterModal,
                    { latitude: tripResult.steps[i].meanLatitude, longitude: tripResult.steps[i].meanLongitude } as ClusterModal))
            tripResult.steps.push(step);
            i++;
        }

        var homeStep2 = homesDataForClustering[Math.floor(steps[steps.length - 1].endTimestamp / 8.64e7) + 1]
        homeStep2.timestamp = Math.floor(steps[steps.length - 1].endTimestamp + 8.64e7)

        var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
        _stepModal2.location = "Home";
        _stepModal2.distanceTravelled = Math.floor(tripResult.steps[i].distanceTravelled +
            ClusterProcessor.EarthDistance({ latitude: _stepModal.meanLatitude, longitude: _stepModal.meanLongitude } as ClusterModal,
                { latitude: tripResult.steps[i].meanLatitude, longitude: tripResult.steps[i].meanLongitude } as ClusterModal))
        _stepModal2.stepId = 10000

        tripResult.steps.push(_stepModal2)

        // Load locations
        for (var step of steps) {
            var result = await TripUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)

            if (result && result.address && (result.address.county || result.address.state_district)) {
                step.location = result.address.county || result.address.state_district

                if (countries.indexOf(result.address.country) == -1) {
                    countries.push(result.address.country)
                }
                if (places.indexOf(step.location) == -1) {
                    places.push(step.location)
                }
                tripResult.countryCode.push((result.address.country_code as string).toLocaleUpperCase())
            }

            // Showing current weather now
            result = await TripUtils.getWeatherFromCoordinates(step.meanLatitude, step.meanLongitude)
            if (result && result.main) {
                if (step.location == "") {
                    step.location = result.name
                    places.push(step.location)
                }
                step.temperature = Math.floor(Number.parseFloat(result.main.temp) - 273.15) + "ºC"
            }
        }
        
        tripResult.tripId = tripId;
        tripResult.populateAll();
        tripResult.populateTitle(countries, places);

        return tripResult
    }


    UpdateProfileDataWithTrip (trip: TripModal) : ProfileModal {
        this.Modal.countriesVisited.push.apply(this.Modal.countriesVisited, trip.countryCode)
        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        this.Modal.countriesVisited = x(this.Modal.countriesVisited); // Removing duplicates
        this.Modal.percentageWorldTravelled = Math.floor(this.Modal.countriesVisited.length*100/186)

        var newTrip: boolean = true;
        for(var _trip of this.Modal.trips) {
            if(_trip.tripId == trip.tripId){ 
                _trip.CopyConstructor(trip); newTrip = false; break; 
            }
        }

        if(newTrip) {
            this.Modal.trips.push(trip)
        }
        
        this.Modal.trips.sort((a: TripModal, b: TripModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })

        return this.Modal
    }

}

export var Instance = new Engine()