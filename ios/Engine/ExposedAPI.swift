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
  func getAllTrips(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = Engine.EngineInstance._BlobProvider.getAllTripsWithData()
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
    var homeData:[HomeDataModal] = homeData as! [HomeDataModal]

    Engine.EngineInstance.SetHomeData(homeData: homeData)
    resolve(true)
  }
  
  @objc
  func generateTripsFromScratch(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    Engine.EngineInstance.Initialize()
    resolve(true)
  }
  
  @objc
  func addTrip(_ trip: [String: Any], resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    var data = TripModal()
    
    data.CopyConstructor(trip: trip)
    
    Engine.EngineInstance.UpdateProfileDataWithTrip(trip: data)
  }
}
