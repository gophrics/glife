//
//  Engine.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 09/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Photos

enum EngineLoadStatus {
  case None
  case Partial
  case Full
}

class AppState {
  var loggedIn : Bool = false
  var engineLoaded: EngineLoadStatus = EngineLoadStatus.None
}


// Only Exposed APIs
class Engine: NSObject {
  
  var _BlobProvider: BlobProvider = BlobProvider()
  static var EngineInstance = Engine()

  func Initialize() -> Bool {
    var photoRollInfos: [ClusterModal] = PhotoLibraryProcessor.getPhotosFromLibrary();
    
    self.GenerateHomeData()
    
    // Create a No photos found warning page
    if (photoRollInfos.count == 0) {
      return true
    }
    
    do {
        var trips = try self.GenerateTripFromPhotos(imageData: photoRollInfos)
        try self.ClearAndUpdateProfileDataWithAllTrips(trips)
    } catch {}
    
    return true
  }
  
  
  func GenerateTripFromPhotos(imageData: [ClusterModal]) {
    var homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering
    var endTimestamp = self._BlobProvider.Modal.endTimestamp

    var clusterData: [ClusterModal] = PhotoLibraryProcessor.convertImageToCluster(images: imageData, endTimestamp: endTimestamp)

    var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);
    var tripResult: [TripModal] = [];
    
    if (trips.length == 0) {
      return
    }
    
    for trip in trips {
      trip.sort((a: ClusterModal, b: ClusterModal) => {
          return a.timestamp < b.timestamp
      });
      var _steps: [StepModal] = ClusterProcessor.RunStepClustering(trip);
      var _trip: TripModal = self.PopulateTripModalData(_steps, TripUtils.GenerateTripId());
      tripResult.push(_trip)
    }
    
    tripResult.sorted(by: {$0.endDate > $1.endDate})
  
  func PopulateTripModalData(steps: [StepModal], tripId: String) -> TripModal {
    var tripResult: TripModal = TripModal();
    var homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering

    var homeStep = homesDataForClustering[(steps[0].startTimestamp / 86400).round(.down) - 1]
    homeStep.timestamp = (steps[0].startTimestamp - 86400)
    
    var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
    _stepModal.location = "Home";
    _stepModal.stepId = 0;
    tripResult.steps.append(_stepModal)
    
    var i = 0;
    var countries: [String] = []
    var places: [String] = []
    
    for step in steps {
      
      var _p = ClusterModal()
      _p.latitude = step.meanLatitude;
      _p.longitude = step.meanLongitude;
      
      var _q = ClusterModal()
      _q.latitude = tripResult.steps[i].meanLatitude;
      _q.longitude = tripResult.steps[i].meanLongitude;
      
      step.distanceTravelled = (tripResult.steps[i].distanceTravelled + ClusterProcessor.EarthDistance(p: _p, q: _q)).round(.down)
      tripResult.steps.append(step);
      i += 1;
    }
    
    var homeStep2 = homesDataForClustering[(steps[steps.count - 1].endTimestamp / 86400).round(.down) + 1]
    homeStep2.timestamp = (steps[steps.length - 1].endTimestamp + 86400).round(.down)
    
    var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
    _stepModal2.location = "Home";
    
    var _p = ClusterModal()
    _p.latitude = _stepModal.meanLatitude
    _p.longitude = _stepModal.meanLongitude

    var _q = ClusterModal()
    _q.latitude = tripResult.steps[i].meanLatitude
    _q.longitude = tripResult.steps[i].meanLongitude
    _stepModal2.distanceTravelled = (tripResult.steps[i].distanceTravelled + ClusterProcessor.EarthDistance(p: _p, q: _q))
    _stepModal2.stepId = 10000
    
    tripResult.steps.append(_stepModal2)
    
    // Load locations
    for step in steps {
      var result = TripUtils.getLocationFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)
      
      if (result != nil) {
        step.location = result
        
        if (countries.firstIndex(of: result) == nil) {
          countries.append(result)
        }
        if (places.firstIndex(of: step.location) == nil) {
          places.append(step.location)
        }
        tripResult.countryCode.append((result.address.country_code as String).toLocaleUpperCase())
      }
      
      // Showing current weather now
      step.temperature = String(TripUtils.getWeatherFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)) + "ºC"
    }
    
    tripResult.tripId = tripId;
    tripResult.populateAll();
    tripResult.populateTitle(countries: countries, places: places);
    
    return tripResult
  }
  
  func GenerateHomeData(){
  
    struct _home{
      var latitude: Float64
      var longitude: Float64
      var timestamp: Int64
    }
    
    var homes: [_home] = [];
    var homesDataForClustering: [Int64:ClusterModal] = [:];
  
    for element in self._BlobProvider.Modal.homeData {
      var res = TripUtils.getCoordinatesFromLocation(location: element.name)
      var _el = _home(latitude: 0, longitude: 0, timestamp: 0)
      _el.latitude = res.latitude
      _el.longitude = res.longitude
      _el.timestamp = element.timestamp
      homes.append(_el)
    }
    
    var startTimestamp = (Date().timeIntervalSince1970/86400).round(.down);
    var endTimestamp = startTimestamp;
    homes.sorted(by: {$0.timestamp < $1.timestamp})
  
    for data in homes {
      while(startTimestamp >= (data.timestamp/86400).round(.down) && startTimestamp >= 0) {
        homesDataForClustering[startTimestamp] = data as ClusterModal;
        startTimestamp -= 1;
      }
    }
  
    self._BlobProvider.Modal.homesForDataClustering = homesDataForClustering;
    self._BlobProvider.Modal.startTimestamp = startTimestamp
    self._BlobProvider.Modal.endTimestamp = endTimestamp
  }
  
  func ExtendHomeDataToDate() {
    var today: Date = Date()
    var endTimestamp = self._BlobProvider.Modal.endTimestamp
    
    var homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering;
    var dataToExtend = homesDataForClustering[endTimestamp]
    
    while(endTimestamp <= Int64(today.timeIntervalSince1970/86400)) {
      homesDataForClustering[endTimestamp] = dataToExtend;
      endTimestamp += 1
    }
    
    self._BlobProvider.Modal.endTimestamp = endTimestamp;
    self._BlobProvider.Modal.homesForDataClustering = homesDataForClustering;
  }
  
  func UpdateProfileDataWithTrip(trip: TripModal) -> TripModal {
    self._BlobProvider.Modal.countriesVisited.append(trip.countryCode)
    self._BlobProvider.Modal.percentageWorldTravelled = (self.Modal.countriesVisited.length * 100 / 186).round(.down)
    
    let _trip: TripModal = try! Realm().objects(TripModal.self).filter("tripId == " + trip.tripId).first ?? TripModal()
    _trip.CopyConstructor(trip: trip)
    
    return trip
  }
}
