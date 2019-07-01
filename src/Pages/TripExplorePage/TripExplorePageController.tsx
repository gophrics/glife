import { TripExplorePageModal } from "./TripExplorePageModal";
import { ImageDataModal } from "../../Engine/Modals/ImageDataModal";
import * as PhotoLibraryProcessor from '../../Engine/Utils/PhotoLibraryProcessor'
import { StepModal } from '../../Engine/Modals/StepModal';
import { TripUtils } from '../../Engine/Utils/TripUtils';
import { ClusterModal } from '../../Engine/Modals/ClusterModal'
import { ClusterProcessor } from '../../Engine/Utils/ClusterProcessor'
import { BlobProvider } from '../../Engine/Providers/BlobProvider';
import { Page } from '../../Modals/ApplicationEnums';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";
import * as PublisherSubscriber from "../../Engine/PublisherSubscriber";

export class TripExplorePageController {

    Modal: TripExplorePageModal
    NewStepId: number
    ProfilePageController: ProfilePageController

    constructor() {
        this.NewStepId = 2;
        this.ProfilePageController = new ProfilePageController()
        this.Modal = new TripExplorePageModal()
        this.Modal.CopyConstructor(PublisherSubscriber.Bus[Page[Page.TRIPEXPLORE]] as TripExplorePageModal || {})
    }

    onNewStepPress = (step: StepModal) => {
        this.NewStepId = step.stepId + 1;
    }

    newStepDone = async (_step: StepModal | null) => {
        if (_step == null) {
            return;
        }

        //Right now, we're calcualting step based on images, and not overriding them
        _step.stepId = this.NewStepId;

        var trip: TripExplorePageModal = this.Modal as TripExplorePageModal
        trip.steps.push(_step);
        trip.steps.sort((a: StepModal, b: StepModal) => {
            return a.stepId - b.stepId;
        })

        trip = await this.PopulateTripExplorePageModalData(trip.steps.slice(1, trip.steps.length - 1), trip.tripId)
        trip.tripName = this.Modal.tripName;

        this.ProfilePageController.UpdateProfileDataWithTrip(trip)
    }

    GenerateTripFromPhotos = async (imageData: ImageDataModal[]): Promise<TripExplorePageModal[]> => {
        var homesDataForClustering = BlobProvider.Instance.homeData
        var endTimestamp = BlobProvider.Instance.endTimestamp

        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(imageData, endTimestamp)
        var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);

        var tripResult: TripExplorePageModal[] = [];

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
                var _trip: TripExplorePageModal = await this.PopulateTripExplorePageModalData(_steps, TripUtils.GenerateTripId());

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

    async PopulateTripExplorePageModalData(steps: StepModal[], tripId: number) {
        var tripResult: TripExplorePageModal = new TripExplorePageModal();
        var homesDataForClustering = BlobProvider.Instance.homeData

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

    onPhotoModalDismiss = (step: StepModal) => {
        for (var _step of this.Modal.steps) {
            if (_step.stepId == step.stepId) {
                _step = step; break;
            }
        }
        BlobProvider.Instance.setBlobValue(Page[Page.STEPEXPLORE], this.Modal)
    }

    getFirstStep = () => {
        if (this.Modal.steps.length == 0)
            throw "No steps found"
        return this.Modal.steps[0]
    }

    getSteps = () => {
        if (this.Modal.steps == undefined || this.Modal.steps == null)
            throw "No steps found"
        return this.Modal.steps
    }
}