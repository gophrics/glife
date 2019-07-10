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
class Engine {
  
  var BlobProvider: BlobProvider = BlobProvider()
  
  func PopulateTripModalData(steps: [StepModal], tripId: String) -> {
    var tripResult: TripModal = new TripModal();
    var homesDataForClustering = self.BlobProvider.Modal.homesForDataClustering

    var homeStep = homesDataForClustering[(steps[0].startTimestamp / 8.64e4).round(.down) - 1]
    homeStep.timestamp = (steps[0].startTimestamp - 8.64e4)
    
    var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
    _stepModal.location = "Home";
    _stepModal.stepId = 0;
    tripResult.steps.append(_stepModal)
    
    var i = 0;
    var countries: [String] = []
    var places: [String] = []
    
    for step in steps) {
      
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
}
