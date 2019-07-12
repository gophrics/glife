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
}
