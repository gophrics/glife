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
          resolve(db.objects(ProfileModal.self).first?.name);
          break;
        case "trips":
          let dbResponse = db.objects(TripModal.self)
          var trips: [[String:Any]] = []
          
          for trip in dbResponse {
            trips.append(trip.GetAsDictionary())
          }
          
          dump(trips, name: "TripDump");
          dump(dbResponse)
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
          let dbResponse = db.objects(ProfileModal.self)
          if let coverPicUrl = dbResponse.first {
            resolve(coverPicUrl);
          } else {
            resolve("https://cms.hostelworld.com/hwblog/wp-content/uploads/sites/2/2017/08/girlgoneabroad.jpg")
          }
          break;
        case "profilePicURL":
          let dbResponse = db.objects(ProfileModal.self)
          
          if let coverPicUrl = dbResponse.first {
            resolve(coverPicUrl);
          } else {
            resolve("https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg")
          }
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
        let data = db.objects(ProfileModal.self)
        
        if let profileData = data.first {
          try! db.write {
            profileData.name = value["name"] as! String;
            print("Profile name: " + profileData.name);
          }
        } else {
          try! db.write {
            let profileData = ProfileModal()
            profileData.name = value["name"] as! String;
            db.add(profileData, update: .all)
          }
        }
        // Name is not being saved by Realm, debug tomorrow
        break;
      default:
        break;
    }
    resolve(true)
  }
  
  @objc
  func getHomeData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let db = try! Realm()
    let dbresult = db.objects(HomeDataModal.self)
    
    var homeDataArray: [[String:Any]] = []
    
    print("getHomeData called")
    for result in dbresult{
      homeDataArray.append(result.GetAsDictionary())
    }
    
    resolve(homeDataArray)
  }
  
  @objc
  func setHomeData(_ homeData:NSArray, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    let db = try! Realm()
    let dbresult = db.objects(HomeDataModal.self)
    
    for result in dbresult {
      try! db.write {
        db.delete(result)
      }
    }
    
    for data in homeData {
      let homeDataModal = HomeDataModal()
      homeDataModal.CloneDictionary(dict: data as! [String:Any])
      try! db.write {
        db.add(homeDataModal)
      }
    }
    
    resolve(true)
  }
  
  @objc
  func getCoordinatesFromLocation(_ location: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let coordinatesArray = TripUtils.getCoordinatesFromLocation(location: location)
    
    var result : [[String:Any]] = []
    
    for _res in coordinatesArray {
        result.append(_res.GetAsDictionary())
    }
    
    resolve(result)
  }
  
  @objc
  func InitializeEngine(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    print("Dump : InitializeEngine called")
    let result = Engine.EngineInstance.Initialize()
    resolve(result)
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
