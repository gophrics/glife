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
  func getProfileData(_ param: String, profileId profileId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
      let db = try! Realm()
      switch(param) {
        case "all":
          let dbData = db.objects(ProfileModal.self)
          if let modal = dbData.first {
            resolve(modal.GetAsDictionary())
          } else {
            resolve(false)
          }
          break;
        case "name":
          let dbData = db.objects(ProfileModal.self)
          if let modal = dbData.first {
            resolve(modal.name)
          } else {
            resolve(false)
          }
          break;
        case "trips":
          let dbData = db.objects(TripModal.self)
          var response: [[String:Any]] = []
          for data in dbData {
            response.append(data.GetAsDictionary())
          }
          resolve(response)
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
  func getTripData(_ op: String, profileId profileId: String, tripId tripId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    let db = try! Realm()
    switch(op) {
      case "all":
        let dbresult = db.objects(TripModal.self).filter{$0.tripId == tripId}
        if let result = dbresult.first {
          resolve(result);
        } else {
          resolve(false);
        }
        break;
      case "steps":
        let dbresult = db.objects(StepModal.self).filter{$0.tripId == tripId}
        if dbresult.count == 0 {
          resolve(false); break;
        }
        var steps: [[String:Any]] = []
        for obj in dbresult {
          steps.append(obj.GetAsDictionary())
        }
        resolve(steps);
        break;
      default:
        resolve(false); break;
    }
  }
  
  @objc
  func getStepData(_ op: String, profileId profileId:String, tripId tripId:String, stepId stepId:Int, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let db = try! Realm()
    let dbresult = db.objects(StepModal.self).filter{$0.tripId == tripId}
    if let _ = dbresult.first {
      switch(op) {
        case "images":
          let dbresult2 = dbresult.filter{$0.stepId == stepId}
          if let result2 = dbresult2.first {
            var resolveResult: [String] = []
            for image in result2.images {
              resolveResult.append(image.image)
            }
            dump(resolveResult)
            resolve(resolveResult); break;
          } else {
            resolve(false)
          }
        default:
          resolve(false); break;
      }
    } else {
      resolve(false)
    }
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
    let result = Engine.EngineInstance.Initialize()
    resolve(result)
  }
  
  @objc
  func GetTotalToLoad(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    print("DEBUG: " + String(Constants.TOTAL_TO_LOAD))
    resolve(0)
  }
  
  @objc
  func GetTotalLoaded(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    print("DEBUG: " + String(Constants.TOTAL_LOADED))
    resolve(0)
  }
  
  @objc
  func GetImageBeingLoaded(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    print("DEBUG: " + String(Constants.IMAGE_LOADED))
    resolve(0)
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

}
