//
//  Engine.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 09/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

enum EngineLoadStatus {
  case None
  case Partial
  case Full
}

class AppState {
  var loggedIn : Bool
  var engineLoaded: EngineLoadStatus
}


// Only Exposed APIs
class Engine: NSObject {
  
  var _BlobProvider: BlobProvider = BlobProvider()
  
  func Initialize() {
    
    var photoRollInfos: [PHAsset] = PhotoLibraryProcessor.getPhotosFromLibrary();
    
    self.GenerateHomeData()
    
    // Create a No photos found warning page
    if (photoRollInfos.length == 0) {
      return true
    }
    
    do {
      try {
        var trips = self.GenerateTripFromPhotos(photoRollInfos)
        self.ClearAndUpdateProfileDataWithAllTrips(trips)
      }
    } catch error {}
    
    return true
  }
  
  
  func GenerateTripFromPhotos() {
    var homesDataForClustering = self._BlobProvider.homesForDataClustering
    var endTimestamp = self._BlobProvider.endTimestamp

    var clusterData: [ClusterModal] = PhotoLibraryProcessor.convertImageToCluster(imageData, endTimestamp)

    var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);
    var tripResult: [TripModal] = [];
    
    if (trips.length == 0) {
      throw "Not enough photos"
    }
    
    for trip in trips {
      trip.sort((a: ClusterModal, b: ClusterModal) => {
          return a.timestamp < b.timestamp
      });
      var _steps: [StepModal] = ClusterProcessor.RunStepClustering(trip);
      var _trip: TripModal = self.PopulateTripModalData(_steps, TripUtils.GenerateTripId());
      tripResult.push(_trip)
    }
    
    tripResult.sort((a, b) => {
      return Date(b.endDate).getTime() < Date(a.endDate).getTime();
    })

  }
  
  func PopulateTripModalData(steps: [StepModal], tripId: String) {
    var tripResult: TripModal = TripModal();
    var homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering

    var homeStep = homesDataForClustering[(steps[0].startTimestamp / 8.64e4).round(.down) - 1]
    homeStep.timestamp = (steps[0].startTimestamp - 8.64e4)
    
    var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
    _stepModal.location = "Home";
    _stepModal.stepId = 0;
    tripResult.steps.append(_stepModal)
    
    var i = 0;
    var countries: [String] = []
    var places: [String] = []
    
    for step in steps {
      
      var _m = ClusterModal()
      _m.latitude = step.meanLatitude;
      _m.longitude = step.meanLongitude;
      
      var _n = ClusterModal()
      _n.latitude = tripResult.steps[i].meanLatitude;
      _n.longitude = tripResult.steps[i].meanLongitude;
      
      step.distanceTravelled = (tripResult.steps[i].distanceTravelled + ClusterProcessor.EarthDistance(_m, _n)).round(.down)
      tripResult.steps.append(step);
      i++;
    }
    
    var homeStep2 = homesDataForClustering[(steps[steps.length - 1].endTimestamp / 8.64e4).round(.down) + 1]
    homeStep2.timestamp = (steps[steps.length - 1].endTimestamp + 8.64e4).round(.down)
    
    var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
    _stepModal2.location = "Home";
    
    var _m = ClusterModal()
    _m.latitude = _stepModal.meanLatitude
    _m.longitude = _stepModal.meanLongitude

    var _n = ClusterModal()
    _n.latitude = tripResult.steps[i].meanLatitude
    _n.longitude = tripResult.steps[i].meanLongitude
    _stepModal2.distanceTravelled = (tripResult.steps[i].distanceTravelled + ClusterProcessor.EarthDistance(_m, _n))
    _stepModal2.stepId = 10000
    
    tripResult.steps.append(_stepModal2)
    
    // Load locations
    for step in steps {
      var result = TripUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)
      
      if (result && result.address && (result.address.county || result.address.state_district)) {
        step.location = result.address.county || result.address.state_district
        
        if (countries.indexOf(result.address.country) == -1) {
          countries.append(result.address.country)
        }
        if (places.indexOf(step.location) == -1) {
          places.append(step.location)
        }
        tripResult.countryCode.push((result.address.country_code as string).toLocaleUpperCase())
      }
      
      // Showing current weather now
      step.temperature = TripUtils.getWeatherFromCoordinates(step.meanLatitude, step.meanLongitude) + "ºC"
    }
    
    tripResult.tripId = tripId;
    tripResult.populateAll();
    tripResult.populateTitle(countries, places);
    
    return tripResult
  }
  
  func GenerateHomeData(){
  
    class _home{
      var latitude: Float64
      var longitude: Float64
      var timestamp: Int64
    }
    
    var homes: [_home] = [];
    var homesDataForClustering: [Int64:ClusterModal] = [:];
  
    for element in this._BlobProvider.homeData {
      var res = TripUtils.getCoordinatesFromLocation(element.name)
      var _el = _home()
      _el.latitude = res.latitude
      _el.longitude = res.longitude
      _el.timestamp = element.timestamp
      homes.append(_el)
    }
    
    var startTimestamp = ((Date()).getTime()/8.64e4).round(.down);
    var endTimestamp = startTimestamp;
    homes.sort((a, b) => {
      return b.timestamp < a.timestamp;
    })
  
    for data in homes {
      while(startTimestamp >= (data.timestamp/8.64e4).round(.down) && startTimestamp >= 0) {
        homesDataForClustering[startTimestamp] = data as ClusterModal;
        startTimestamp--;
      }
    }
  
    self._BlobProvider.homesForDataClustering = homesDataForClustering;
    self._BlobProvider.startTimestamp = startTimestamp
    self._BlobProvider.endTimestamp = endTimestamp
    self.SaveEngineData()
  }
  
  func ExtendHomeDataToDate() {
    var today: Date = Date()
    var endTimestamp = self._BlobProvider.endTimestamp
    
    var homesDataForClustering = self._BlobProvider.homesForDataClustering;
    var dataToExtend = homesDataForClustering[endTimestamp]
    
    while(endTimestamp <= today.getTime()/8.64e4) {
      homesDataForClustering[endTimestamp] = dataToExtend;
      endTimestamp++
    }
    
    self._BlobProvider.endTimestamp = endTimestamp;
    self._BlobProvider.homesForDataClustering = homesDataForClustering;
    self.SaveEngineData()
  }
  
  func UpdateProfileDataWithTrip(trip: TripModal) {
    self._BlobProvider.Modal.countriesVisited.push.apply(this.Modal.countriesVisited, trip.countryCode)
    self._BlobProvider.Modal.percentageWorldTravelled = (this.Modal.countriesVisited.length * 100 / 186).round(.down)
    
    var newTrip: boolean = true;
    for _trip in self._BlobProvider.Modal.trips {
      if (_trip.tripId == trip.tripId) {
        _trip.CopyConstructor(trip)
        newTrip = false;
        break;
      }
    }
    
    if (newTrip) {
      this.Modal.trips.push(trip)
    }
    
    self._BlobProvider.Modal.Modal.trips.sort((a: TripModal, b: TripModal) => {
      return Date(b.endDate).getTime() < Date(a.endDate).getTime();
    })
    return trip
  }
}

}

var EngineInstance = Engine()
