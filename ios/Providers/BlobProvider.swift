//
//  BlobProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objc
class EngineModal: Object {
  @objc dynamic var homeData: [HomeDataModal] = []
  @objc dynamic var homesForDataClustering: [HomeDataModal] = []
  @objc dynamic var startTimestamp: Int64 = 0
  @objc dynamic var endTimestamp: Int64 = 0
  @objc dynamic var blobLoaded: Bool = false;
  @objc dynamic var engineBlobLoaded: Bool = false;
  @objc dynamic var email: String = "";
  @objc dynamic var password: String = "";
}


@objc
class EngineBlob: Object {
  @objc dynamic var profileData: ProfileModal = ProfileModal()
  @objc dynamic var trips: [TripModal] = []
  
  func setTrip(trip: TripModal) {
    let _t = Database.db.objects(TripModal.self).filter("tripId == " + trip.tripId).first
    if(_t != nil) {
      _t!.CopyConstructor(trip: trip)
    } else {
      try! realm!.write {
        realm!.add(trip)
      }
    }
  }
}

class BlobProvider {
  
  var Modal: EngineModal = EngineModal()
  var Blob: EngineBlob = EngineBlob()
  
  init() {
    self.loadEngineData()
  }
  
  func getAllTripsWithData() -> [[String: Any]] {
    var trips: [TripModal] = []
    let _relmResults = try! Realm().objects(TripModal.self)
    
    for trip in _relmResults {
      trips.append(trip)
    }
    
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
    
    return tripMetaArray
  }
  
  func getTrip(tripId: String) -> TripModal {
    let trip: TripModal = try! Realm().object(ofType: TripModal.self, forPrimaryKey: tripId) ?? TripModal()
    return trip
  }
  
  func getProfileData() -> [String: Any] {
    let profile: ProfileModal = try! Realm().objects(ProfileModal.self).first ?? ProfileModal()
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
    var currentEngineModal = Database.db.objects(EngineModal.self).first
    if(currentEngineModal != nil) {
      try! Database.db.write {
        currentEngineModal = self.Modal
      }
    } else {
      try! Database.db.write {
        Database.db.add(self.Modal)
      }
    }
  }
  
  func loadEngineData() {
    self.Modal = Database.db.objects(EngineModal.self).first!
  }
}
