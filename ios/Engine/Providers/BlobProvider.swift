//
//  BlobProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class EngineModal {
  @objc dynamic var homeData: [HomeDataModal] = []
  @objc dynamic var homesForDataClustering: [Int64: String] = [:]
  @objc dynamic var startTimestamp: Int64 = 0
  @objc dynamic var endTimestamp: Int64 = 0
  @objc dynamic var blobLoaded: Bool = false;
  @objc dynamic var engineBlobLoaded: Bool = false;
  @objc dynamic var email: String = "";
  @objc dynamic var password: String = "";
}

class BlobProvider {
  
  var Modal: EngineModal = EngineModal()
  
  init() {
    
  }
  
  func getAllTripsWithData() {
    var trips: [TripModal] = try! Realm().objects(TripModal.self)
    var tripMetaArray: [[String: Any]] = []
    for trip in trips {
      var tripMeta: [String: Any] = [:]
      tripMeta["masterPicURL"] = trip.masterPicURL
      tripMeta["profileId"] = trip.profileId
      tripMeta["startDate"] = trip.startDate
      tripMeta["temperature"] = trip.temperature
      tripMeta["countryCode"] = trip.countryCode
      tripMeta["tripId"] = trip.tripId
      
      tripMetaArray.append(tripMeta)
    }
    
    return trips
  }
  
  func getTrip(tripId: String) {
    var trip: TripModal = try! Realm().object(ofType: TripModal.self, forPrimaryKey: tripId)
    return trip
  }
  
  func getProfileData() {
    var profile: ProfileModal = try! Realm().objects(ofType: ProfileModal.self).first
    var profileMeta: [String: Any] = [:]
    
    profileMeta["countriesVisited"] = profile.countriesVisited
    profileMeta["coverPicURL"] = profile.coverPicURL
    profileMeta["profilePicURL"] = profile.profilePicURL
    profileMeta["profileId"] = profile.profileId
    profileMeta["percentageWorldTravelled"] = profile.percentageWorldTravelled
    profileMeta["name"] = profile.name
    
    return profileMeta
  }
  
  func saveEngineData() {
    let currentEngineModal = Database.db.objects(EngineModal.self)
    try! Database.db.write {
      currentEngineModal = self.Modal
    }
  }
  
  func loadEngineData() {
    self.Modal = Database.db.objects(EngineModal.self)
  }
  
}
