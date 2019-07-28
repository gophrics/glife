//
//  TripModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class TripModal: Object {
  dynamic var profileId: String = ""
  dynamic var tripId: String = ""
  dynamic var location : Region? = Region()
  dynamic var tripName: String = ""
  dynamic var countryCode: List<Country> = List<Country>()
  dynamic var temperature : String = ""
  dynamic var daysOfTravel: Int = 0
  dynamic var distanceTravelled : Int = 0
  dynamic var startDate: String = ""
  dynamic var endDate: String = ""
  dynamic var masterPicURL: String = ""
  dynamic var isPublic: Bool = false
  dynamic var syncComplete: Bool = false
  
  func GetAsDictionary() -> [String:Any] {
    var dict : [String: Any] = [:]
    dict["profileId"] = self.profileId;
    dict["tripId"] = self.tripId;
    dict["location"] = self.location;
    dict["tripName"] = self.tripName;
    dict["countryCode"] = self.countryCode;
    dict["temperature"] = self.temperature;
    dict["daysOfTravel"] = self.daysOfTravel;
    dict["distanceTravelled"] = self.distanceTravelled;
    dict["startDate"] = self.startDate;
    dict["endDate"] = self.endDate;
    dict["masterPicURL"] = self.masterPicURL;
    dict["isPublic"] = self.isPublic;
    dict["syncComplete"] = self.syncComplete;
    
    return dict;
  }
  
  func CopyConstructor(modal: TripModal) {
    //self.profileId = modal.profileId;
    //self.tripId = modal.tripId;
    self.location = modal.location;
    self.tripName = modal.tripName;
    self.countryCode = modal.countryCode;
    self.temperature = modal.temperature;
    self.daysOfTravel = modal.daysOfTravel;
    self.distanceTravelled = modal.distanceTravelled;
    self.startDate = modal.startDate;
    self.endDate = modal.endDate;
    self.masterPicURL = modal.masterPicURL;
    //self.isPublic = modal.isPublic;
    self.syncComplete = false;
  }
  
}
