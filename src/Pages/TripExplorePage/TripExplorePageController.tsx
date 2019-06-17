import { TripExplorePageModal } from "./TripExplorePageModal";
import { ImageDataModal } from "../../Modals/ImageDataModal";
import * as PhotoLibraryProcessor from '../../Engine/PhotoLibraryProcessor'
import { StepModal } from '../../Modals/StepModal';
import { TripUtils } from '../../Engine/TripUtils';
import { ClusterModal } from '../../Modals/ClusterModal'
import { ClusterProcessor } from '../../Engine/ClusterProcessor'
import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad';
import { Page } from '../../Modals/ApplicationEnums';
import { ProfilePageController } from "../ProfilePage/ProfilePageController";

export class TripExplorePageController {

    Modal: TripExplorePageModal
    NewStepId: number
    ProfilePageController: ProfilePageController

    constructor() {
        this.Modal = new TripExplorePageModal()
        this.NewStepId = 2;
        this.ProfilePageController = new ProfilePageController()
    }

    onNewStepPress = (step: StepModal) => {
        this.NewStepId = step.id + 1;
    }

    newStepDone = async(_step: StepModal|null) => {
        if(_step == null) {
            return;
        }

        //Right now, we're calcualting step based on images, and not overriding them
        _step.id = this.NewStepId;

        var trip: TripExplorePageModal = this.Modal as TripExplorePageModal
        trip.tripAsSteps.push(_step);
        trip.tripAsSteps.sort((a: StepModal, b: StepModal) => {
            return a.id - b.id;
        })

        trip = await this.PopulateTripExplorePageModalData(trip.tripAsSteps.slice(1, trip.tripAsSteps.length-1), trip.tripId)
        trip.title = this.Modal.title;

        var profileData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        profileData = this.ProfilePageController.UpdateProfileDataWithTrip(profileData, trip)
        
        profileData.trips.sort((a: TripExplorePageModal, b: TripExplorePageModal) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        })

        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], profileData)
    }
    
    GenerateTripFromPhotos = async(imageData: ImageDataModal[]) : Promise<TripExplorePageModal[]> => {
        var homesDataForClustering = BlobSaveAndLoad.Instance.homeData
        var endTimestamp = BlobSaveAndLoad.Instance.endTimestamp
  
        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(imageData, endTimestamp)
        var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);
  
        var tripResult: TripExplorePageModal[] = [];
  
        if(trips.length == 0) throw "Not enough photos"
  
        TripUtils.TOTAL_TO_LOAD = trips.length;
  
        var asynci = 0;
        for(var i = 0; i < trips.length; i++){
  
            try {
                var trip = trips[i]
  
                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp-b.timestamp
                });
                
                var _steps: StepModal[] = ClusterProcessor.RunStepClustering(trip);
                var _trip: TripExplorePageModal = await this.PopulateTripExplorePageModalData(_steps, TripUtils.GenerateTripId());
                tripResult.push(_trip)
  
                asynci++;
  
                TripUtils.FINISHED_LOADING = asynci
                
                if(asynci == trips.length) {
                    tripResult.sort((a, b) => {
                        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                    })
                }
            } catch(err) {
                i--;
            }
        }
  
        return tripResult;
    }
  
    async PopulateTripExplorePageModalData (steps: StepModal[], tripId: number) {
      var tripResult : TripExplorePageModal = new TripExplorePageModal();
      var homesDataForClustering = BlobSaveAndLoad.Instance.homeData
  
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
          var result = await TripUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)
          
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
          result = await TripUtils.getWeatherFromCoordinates(step.meanLatitude, step.meanLongitude)
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

    onPhotoModalDismiss = (step: StepModal) => {
        for(var _step of this.Modal.tripAsSteps) {
            if(_step.id == step.id) {
                _step = step; break;
            }
        }
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.STEPEXPLORE], this.Modal)
    }

    getFirstStep = () => {
        if(this.Modal.tripAsSteps.length == 0) 
            throw "No steps found"
        return this.Modal.tripAsSteps[0]
    }

    getSteps = () => {
        if(this.Modal.tripAsSteps == undefined || this.Modal.tripAsSteps == null) 
            throw "No steps found"
        return this.Modal.tripAsSteps
    }
}