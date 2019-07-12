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
    var data = EngineInstance._BlobProvider.getAllTripsWithData()
    resolve(data)
  }
  
  @objc
  func getTrip(_ tripId: Int, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = EngineInstance._BlobProvider.getTrip(tripId)
    resolve(data)
  }
  
  @objc
  func getProfileData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = EngineInstance._BlobProvider.getProfileData()
    resolve(data)
  }
  
  @objc
  func generateTripsFromScratch(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    EngineInstance.Initialize()
    resolve(true)
  }
  
  @objc
  func addTrip(_ trip: [String: Any], resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = TripModal()
    
    data.activities = trip["activities"]
    data.countryCode = trip["countryCode"]
    data.daysOfTravel = trip["daysOfTravel"]
    data.distanceTravelled = trip["distanceTravelled"]
    data.endDate = trip["endDate"]
    data.isPublic = trip["isPublic"]
    data.location = trip["location"]
    data.masterPicURL = trip["masterPicURL"]
    data.profileId = trip["profileId"]
    data.startDate = trip["startDate"]
    data.syncComplete = trip["syncComplete"]
    data.temperature = trip["temperature"]
    data.tripId = trip["tripId"]
    data.tripName = trip["tripName"]
    
    EngineInstance.UpdateProfileDataWithTrip(data)
  }
}
