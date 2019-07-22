//
//  ExposedAPI.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 12/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


@objc(ExposedAPI)
class ExposedAPI: NSObject {
    
   @objc
   func getTripsMeta(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        // TODO: Get meta of all trips for better memory
        resolve(data)
   }
  
   @objc
   func getTrip(_ tripId: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        var data = Engine.EngineInstance._BlobProvider.getTrip(tripId: tripId)
        resolve(data)
   }
  
   @objc
   func getProfileData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        var data = Engine.EngineInstance._BlobProvider.getProfileData()
        resolve(data)
   }

   @objc
   func setHomeDataFromUI(_ homeData: NSArray) {
        let homeData:[HomeDataModal] = homeData as! [HomeDataModal]
        Engine.EngineInstance.SetHomeData(data: homeData)
   }
  
   @objc
   func addNewTrip(_ tripName: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
        let today = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat="dd-MM-yyyy"
    
        let data = TripModal()
        data.startDate = dateFormatter.string(from: today)
        data.endDate = dateFormatter.string(from: today)
        data.tripName = tripName
        data.tripId = TripUtils.GenerateTripId()
        var operationResult = Engine.EngineInstance.UpdateProfileDataWithTrip(trip: data)
        resolve(operationResult)
   }
  
   @objc
   func getHomeData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Engine.EngineInstance._BlobProvider.Modal.homeData)
   }
  
    @objc
    func getName(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Engine.EngineInstance._BlobProvider.Blob.profileData.name)
    }
  
    @objc
    func setHomeTimestamp(_ timestamp: Int64, index: Int, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Engine.EngineInstance._BlobProvider.Modal.homeData[index].timestamp = timestamp
        resolve(true)
    }
    
    
    @objc
    func InitializeEngine(_ homeData: NSArray, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        var result = Engine.EngineInstance.Initialize(homeData as! [HomeDataModal])
        resolve(result)
    }
    
    @objc
    func getCoordinatesFromLocation(_ name: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        var result = TripUtils.getCoordinatesFromLocation(name)
        resovle(result)
    }
    
    
    @objc
    func setProfilePic(_ profilePicData: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Engine.EngineInstance.Modal.profilePicData = profilePicData;
        resolve(true)
    }
    
    
    @objc
    func setCoverPic(_ coverPicURL: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Engine.EngineInstance.Modal.coverPicURL = coverPicURL;
        resolve(true)
    }
    
    @objc
    func getProfileMeta(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        // TODO: Get all profile data to be displayed in profile page
        resolve(true)
    }

}
