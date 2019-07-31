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

class Engine {

    static var EngineInstance = Engine()

    init() {
        //self.ExtendHomeDataToDate()
    }
    
    func Initialize() -> Bool {
        // Clear out all the trips
        DatabaseProvider.ClearAllTrips()
      
        let dbHomeDataArray = (try! Realm()).objects(HomeDataModal.self)
        let homeDataArray: List<HomeDataModal> = List<HomeDataModal>();
      
        for homeData in dbHomeDataArray {
          homeDataArray.append(homeData)
        }
      
        try! self.GenerateHomeData(homeData: homeDataArray)
      
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
        
        let trips = try! PhotoLibraryProcessor.GenerateTripFromPhotos(clusterData: photoRollInfos)
        DatabaseProvider.UpdateDBWithTrips(trips: trips)
        return true
    }
  
    
  
  func GenerateHomeData(homeData: List<HomeDataModal>) throws  {
      if(homeData.count == 0) {
        throw EngineError.coreEngineError(message: "No homes as input to be processed")
      }
    
      let today = Date()
    
      // Populate array till today with empty object
      var homesForDataClustering: [HomesForDataClusteringModal] = []
      for _ in 0...Int(today.timeIntervalSince1970/86400) + 1 {
        homesForDataClustering.append(HomesForDataClusteringModal())
      }
    
      // Modify timestamp and location of objects in accordance with homeData input from user
      var currentTimestamp = Date().timeIntervalSince1970/86400
      for data in homeData {
        var coordinates = TripUtils.getCoordinatesFromLocation(location: data.name)
        let _region = coordinates.count > 0 ? coordinates[0] : Region() //Bug, user should select ? 
        
        while(currentTimestamp >= data.timestamp/86400) {
          
          homesForDataClustering[Int(currentTimestamp)].timestamp = currentTimestamp
          homesForDataClustering[Int(currentTimestamp)].name = data.name;
          homesForDataClustering[Int(currentTimestamp)].latitude = _region.latitude;
          homesForDataClustering[Int(currentTimestamp)].longitude = _region.longitude;
          
          currentTimestamp -= 1
        }
      }
    
      DatabaseProvider.UpdateDBWithHomesForDataClustering(homes: homesForDataClustering)
    }
  
  
}
