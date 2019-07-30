//
//  Engine.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 09/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Photos
import RealmSwift

enum EngineLoadStatus {
  case None
  case Partial
  case Full
}

class AppState {
  var loggedIn : Bool = false
  var engineLoaded: EngineLoadStatus = EngineLoadStatus.None
}


class Engine {
  
    var _BlobProvider: BlobProvider = BlobProvider()
    static var EngineInstance = Engine()

    init() {
        //self.ExtendHomeDataToDate()
    }
    
    func Initialize() -> Bool {
        let dbHomeDataArray = (try! Realm()).objects(HomeDataModal.self)
        let homeDataArray: List<HomeDataModal> = List<HomeDataModal>();
      
        for homeData in dbHomeDataArray {
          homeDataArray.append(homeData)
        }
      
        let homesForDataClustering = try! self.GenerateHomeData(homeData: homeDataArray)
      
        // Clear out all the trips
        self.ClearTripDB()
        let photos = PHPhotoLibrary.authorizationStatus()
        if photos == .notDetermined {
          PHPhotoLibrary.requestAuthorization({status in
            if status != .authorized{
              return;
            }
          })
        }
      
        let photoRollInfos: [ClusterModal] = PhotoLibraryProcessor.getPhotosFromLibrary();
      
        // Create a No photos found warning page
        if (photoRollInfos.count == 0) {
          print("Dump: No photos found (Check photo permission?)")
          return true
        }
        
        let trips = try! PhotoLibraryProcessor.GenerateTripFromPhotos(clusterData: photoRollInfos, homesForDataClustering: homesForDataClustering, endTimestamp: self._BlobProvider.Modal.endTimestamp)
        self.UpdateDBWithTrips(trips: trips)
        return true
    }

    func SetHomeData(data: List<HomeDataModal>) {
      self._BlobProvider.Modal.homeData = data
    }
  
    func ClearTripDB() {
        let db = try! Realm()
        let dbObjects = db.objects(TripModal.self)
        for object in dbObjects {
          try! db.write {
              db.delete(object)
          }
        }
        let dbObjects2 = db.objects(StepModal.self)
        for object in dbObjects2 {
          try! db.write {
            db.delete(object)
          }
        }
    }
  
    func UpdateDBWithTrips(trips: [TripModal]) {
      let db = try! Realm();
      
      for trip in trips{
        let dbResult = db.objects(TripModal.self).filter{ $0.tripId == trip.tripId }
        if let _trip = dbResult.first {
          try! db.write {
            // Right now we're deleting and adding the object everywhere, because that is what seem to work
            db.delete(_trip)
            db.add(trip)
          }
        } else {
          try! db.write {
            db.add(trip)
          }
        }
      }
    }
  
  func GenerateHomeData(homeData: List<HomeDataModal>) throws -> List<HomesForDataClusteringModal> {
      if(homeData.count == 0) {
        throw EngineError.coreEngineError(message: "No homes as input to be processed")
      }
      
      let homesForDataClustering: List<HomesForDataClusteringModal> = List<HomesForDataClusteringModal>()
    
      let today = Date()
    
      // Populate array till today with empty object
      for i in 0...Int(today.timeIntervalSince1970/86400) + 1 {
        homesForDataClustering.append(HomesForDataClusteringModal())
      }
    
      // Modify timestamp and location of objects in accordance with homeData input from user
      var currentTimestamp = Int(Date().timeIntervalSince1970/86400)
      for data in homeData {
        var coordinates = TripUtils.getCoordinatesFromLocation(location: data.name)
        let _region = coordinates.count > 0 ? coordinates[0] : Region() //Bug, user should select ? 
        
        while(currentTimestamp >= Int(data.timestamp/86400)) {
          
          homesForDataClustering[currentTimestamp].timestamp = Int64(currentTimestamp)
          homesForDataClustering[currentTimestamp].name = data.name;
          homesForDataClustering[currentTimestamp].latitude = _region.latitude;
          homesForDataClustering[currentTimestamp].longitude = _region.longitude;
          
          currentTimestamp -= 1
        }
      }
      
      return homesForDataClustering
    }
  
  
  func ExtendHomeDataToDate() {
    let today: Date = Date()
    var endTimestamp = self._BlobProvider.Modal.endTimestamp
    
    let homesDataForClustering = self._BlobProvider.Modal.homesForDataClustering;
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
    self._BlobProvider.Blob.profileData.countriesVisited = List<Country>()
    for countryCode in trip.countryCode {
      let _obj = Country()
      _obj.country = countryCode.country
      self._BlobProvider.Blob.profileData.countriesVisited.append(_obj)
    }
    self._BlobProvider.Blob.profileData.percentageWorldTravelled = Float((self._BlobProvider.Blob.profileData.countriesVisited.count * 100 / 186))    
    let _trip: TripModal = try! Database.db.objects(TripModal.self).filter{ $0.tripId == trip.tripId} .first ?? TripModal()
    
    return _trip
  }
}
