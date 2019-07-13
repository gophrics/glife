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
    self._BlobProvider.Modal.homesForDataClustering = self.GenerateHomeData(homeData: self._BlobProvider.Modal.homeData)
    
    var photoRollInfos: [ClusterModal] = PhotoLibraryProcessor.getPhotosFromLibrary();
  
    // Create a No photos found warning page
    if (photoRollInfos.count == 0) {
      return true
    }
    
    do {
      var trips = try PhotoLibraryProcessor.GenerateTripFromPhotos(clusterData: photoRollInfos, homesForDataClustering: self._BlobProvider.Modal.homesForDataClustering, endTimestamp: self._BlobProvider.Modal.endTimestamp)
        try self.ClearAndUpdateProfileDataWithAllTrips(trips)
    } catch {}
    
    return true
  }
  
  func GenerateHomeData(homeData: [HomeDataModal]) throws -> [HomeDataModal] {
    if(homeData.count == 0) {
      //throw runtimeError("No homes as input to be processed")
    }
    
    var homesForDataClustering: [HomeDataModal] = []
    
    for _ in 0...Int(homeData[0].timestamp/86400) {
      homesForDataClustering.append(HomeDataModal())
    }
    
    var currentTimestamp = Int(Date().timeIntervalSince1970/86400)
    for data in homeData {
      while(currentTimestamp >= Int(data.timestamp/86400)) {
        let _el = HomeDataModal()
        _el.timestamp = Int64(currentTimestamp)
        _el.name = data.name
        
        let _region = TripUtils.getCoordinatesFromLocation(location: _el.name)
        _el.latitude = _region.latitude
        _el.longitude = _region.longitude
        homesForDataClustering[currentTimestamp] = _el
        currentTimestamp -= 1
      }
    }
    
    return homesForDataClustering
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
