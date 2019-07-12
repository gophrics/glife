//
//  ExposedAPI.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 12/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


@objc
class ExposedAPI {
  @objc
  func getAllTrips(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = Engine.EngineInstance._BlobProvider.getAllTripsWithData()
    resolve(data)
  }
  
  @objc
  func getTrip(_ tripId: Int, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = Engine.EngineInstance._BlobProvider.getTrip(tripId)
    resolve(data)
  }
  
  @objc
  func getProfileData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = Engine.EngineInstance._BlobProvider.getProfileData()
    resolve(data)
  }
  
  @objc
  func generateTripsFromScratch(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    Engine.EngineInstance.Initialize()
    resolve(true)
  }
  
  @objc
  func addTrip(_ trip: [String: Any], resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = TripModal()
    
    data.activities = trip["activities"] as? String
    data.countryCode = trip["countryCode"] as? [String]
    data.daysOfTravel = trip["daysOfTravel"] as? Int
    data.distanceTravelled = trip["distanceTravelled"] as? Int
    data.endDate = trip["endDate"] as? String
    data.isPublic = trip["isPublic"] as? Bool
    data.location = trip["location"] as? String
    data.masterPicURL = trip["masterPicURL"] as? String
    data.profileId = trip["profileId"] as? String
    data.startDate = trip["startDate"] as? String
    data.syncComplete = trip["syncComplete"] as? Bool
    data.temperature = trip["temperature"] as? String
    data.tripId = trip["tripId"] as? String
    data.tripName = trip["tripName"] as? String
    
    Engine.EngineInstance.UpdateProfileDataWithTrip(trip: data)
  }
}
