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
    let homeData:[HomeDataModal] = homeData as! [HomeDataModal]
    Engine.EngineInstance.SetHomeData(data: homeData)
  }
  
  @objc
  func generateTripsFromScratch(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    Engine.EngineInstance.Initialize()
    resolve(true)
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
  func getAllHomeData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(Engine.EngineInstance._BlobProvider.Modal.homeData)
  }
  
  @objc
  func getHomeData(_ index: Int, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(Engine.EngineInstance._BlobProvider.Modal.homeData[index])
  }
  
  @objc
  func getName(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(Engine.EngineInstance._BlobProvider.Blob.profileData.name)
  }
  
  @objc
  func setAllHomeData(_ homeData: NSArray, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    Engine.EngineInstance._BlobProvider.Modal.homeData = homeData as! [HomeDataModal]
    resolve(true)
  }
  
  @objc
  func setHomeTimestamp(_ timestamp: Int64, index: Int, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    Engine.EngineInstance._BlobProvider.Modal.homeData[index].timestamp = timestamp
    resolve(true)
  }

}
