//
//  ExposedAPI.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 12/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objc(ExposedAPI)
class ExposedAPI: NSObject {
    
  
  @objc
  func getProfileData(_ param: String, profileId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
      let db = try! Realm()
      switch(param) {
        case "name":
          print("Name found ? " + (db.objects(ProfileModal.self).first?.name ?? "A") );
          resolve(db.objects(ProfileModal.self).first?.name);
          break;
        case "trips":
          var dbResponse = db.objects(TripModal.self)
          var trips: [TripModal] = []
          for trip in dbResponse {
            trips.append(trip)
          }
          resolve(trips)
          break;
        case "percentageWorldTravelled":
          resolve(db.objects(ProfileModal.self).first?.percentageWorldTravelled)
          break;
        case "countriesVisited":
          let dbResponse = db.objects(ProfileModal.self).first?.countriesVisited ?? List<Country>()
          var countriesVisited : [Country] = []
          for country in dbResponse {
            countriesVisited.append(country)
          }
          resolve(countriesVisited)
          break;
        case "coverPicURL":
          let dbResponse = db.objects(ProfileModal.self).first?.coverPicURL ?? "https://cms.hostelworld.com/hwblog/wp-content/uploads/sites/2/2017/08/girlgoneabroad.jpg"
          resolve(dbResponse)
          break;
        case "profilePicURL":
          let dbResponse = db.objects(ProfileModal.self).first?.profilePicURL ?? "https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg"
          resolve(dbResponse)
          break;
        case "email":
          let dbResponse = db.objects(ProfileModal.self).first?.email
          resolve(dbResponse)
          break;
        case "password":
          let dbResponse = db.objects(ProfileModal.self).first?.password
          resolve(dbResponse)
          break;
        default: resolve(nil)
      }
  }
  
  @objc
  func setProfileData(_ value: NSDictionary, param param:String, profileId profileId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let db = try! Realm()
    switch(param) {
      case "name":
        print("Setting name as " + (value["name"] as! String) );
        let profileData = db.objects(ProfileModal.self).first!
        try! db.write() {
          profileData.name = value["name"] as? String ?? "";
        }
        break;
      default:
        break;
    }
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
   func getHomeData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Engine.EngineInstance._BlobProvider.Modal.homeData)
   }
    
    @objc
    func setName(_ name: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(true)
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
    func InitializeEngine(_ homeData: NSArray, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        var homeDataList = List<HomeDataModal>()
        for data in homeData {
          homeDataList.append(data as! HomeDataModal)
        }
        var result = Engine.EngineInstance.Initialize(homeData: homeDataList)
        resolve(result)
    }
    
    @objc
    func getCoordinatesFromLocation(_ name: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
      var result = TripUtils.getCoordinatesFromLocation(location: name)
      resolve(result)
    }
    
    
    @objc
    func setProfilePic(_ profilePicData: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Engine.EngineInstance._BlobProvider.Blob.profileData.profilePicURL = profilePicData;
        resolve(true)
    }
    
    
    @objc
    func setCoverPic(_ coverPicURL: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        Engine.EngineInstance._BlobProvider.Blob.profileData.coverPicURL = coverPicURL;
        resolve(true)
    }
    
    @objc
    func getProfileMeta(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        // TODO: Get all profile data to be displayed in profile page
        resolve(true)
    }

}
