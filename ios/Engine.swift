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


final class Engine {
  
    var _BlobProvider: BlobProvider = BlobProvider()
    static var EngineInstance = Engine()

    init() {
        print("Init called for Engine")
        self.ExtendHomeDataToDate()
    }
    
    func Initialize(homeData: [HomeDataModal]) -> Bool {
      self.SetHomeData(data: homeData);
        
        self._BlobProvider.Modal.homesForDataClustering = try! self.GenerateHomeData(homeData: self._BlobProvider.Modal.homeData)
        
        let photoRollInfos: [ClusterModal] = PhotoLibraryProcessor.getPhotosFromLibrary();
      
        // Create a No photos found warning page
        if (photoRollInfos.count == 0) {
          return true
        }
        
        let trips = try! PhotoLibraryProcessor.GenerateTripFromPhotos(clusterData: photoRollInfos, homesForDataClustering: self._BlobProvider.Modal.homesForDataClustering, endTimestamp: self._BlobProvider.Modal.endTimestamp)
        self.ClearAndUpdateProfileDataWithAllTrips(trips: trips)
        return true
    }

    func SetHomeData(data: [HomeDataModal]) {
      self._BlobProvider.Modal.homeData = data
    }
  
   func ClearAndUpdateProfileDataWithAllTrips(trips: [TripModal]) {
    //TODO: Update profile data
    for trip in trips {
      self._BlobProvider.Blob.setTrip(trip: trip)
    }
  }
  
  func GenerateHomeData(homeData: [HomeDataModal]) throws -> [HomeDataModal] {
    if(homeData.count == 0) {
      throw EngineError.coreEngineError(message: "No homes as input to be processed")
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
    let today: Date = Date()
    var endTimestamp = self._BlobProvider.Modal.endTimestamp
    
    var homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering;
    let dataToExtend = homesDataForClustering[Int(endTimestamp)]
    
    while(endTimestamp <= Int64(today.timeIntervalSince1970/86400)) {
      homesDataForClustering[Int(endTimestamp)] = dataToExtend;
      endTimestamp += 1
    }
    
    self._BlobProvider.Modal.endTimestamp = endTimestamp;
    self._BlobProvider.Modal.homesForDataClustering = homesDataForClustering;
  }
  
  func UpdateProfileDataWithTrip(trip: TripModal) -> TripModal {
    // Bug
    self._BlobProvider.Blob.profileData.countriesVisited = trip.countryCode
    self._BlobProvider.Blob.profileData.percentageWorldTravelled = Float((self._BlobProvider.Blob.profileData.countriesVisited.count * 100 / 186))    
    let _trip: TripModal = try! Database.db.objects(TripModal.self).filter("tripId == " + trip.tripId).first ?? TripModal()
    _trip.CopyConstructor(trip: trip)
    
    return _trip
  }
}
