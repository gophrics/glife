//
//  TripModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objc
class TripModal: Object {
  @objc dynamic var profileId: String = ""
  @objc dynamic var tripId: String = ""
  @objc dynamic var steps: [StepModal] = []
  @objc dynamic var location : Region = Region()
  @objc dynamic var tripName: String = ""
  @objc dynamic var countryCode: [String] = []
  @objc dynamic var temperature : String = ""
  @objc dynamic var daysOfTravel: Int = 0
  @objc dynamic var distanceTravelled : Int = 0
  @objc dynamic var activities: [String] = []
  @objc dynamic var startDate: String = ""
  @objc dynamic var endDate: String = ""
  @objc dynamic var masterPicURL: String = ""
  @objc dynamic var masterPicBase64: String = ""
  @objc dynamic var isPublic: Bool = false
  @objc dynamic var syncComplete: Bool = false
  
  
  func CopyConstructor(trip: [String:Any]) {
    self.activities = trip["activities"] as! [String]
    self.countryCode = trip["countryCode"] as! [String]
    self.daysOfTravel = trip["daysOfTravel"] as! Int
    self.distanceTravelled = trip["distanceTravelled"] as! Int
    self.endDate = trip["endDate"] as! String
    self.isPublic = trip["isPublic"] as! Bool
    self.location = trip["location"] as! Region // this might be problematic
    self.masterPicURL = trip["masterPicURL"] as! String
    self.profileId = trip["profileId"] as! String
    self.startDate = trip["startDate"] as! String
    self.syncComplete = trip["syncComplete"] as! Bool
    self.temperature = trip["temperature"] as! String
    self.tripId = trip["tripId"] as! String
    self.tripName = trip["tripName"] as! String
    
  }
  
  func CopyConstructor(trip: TripModal) {
    self.activities = trip.activities
    self.countryCode = trip.countryCode
    self.daysOfTravel = trip.daysOfTravel
    self.distanceTravelled = trip.distanceTravelled
    self.endDate = trip.endDate
    self.isPublic = trip.isPublic
    self.location = trip.location
    self.masterPicURL = trip.masterPicURL
    self.profileId = trip.profileId
    self.startDate = trip.startDate
    self.syncComplete = trip.syncComplete
    self.temperature = trip.temperature
    self.tripId = trip.tripId
    self.tripName = trip.tripName
  }
  
  func populateAll() {
    self.populateMasterPic();
    self.populateDaysOfTravel();
    self.populateDistanceTravelled();
    self.populateDates();
    self.populateLocation();
    self.populateTemperature();
  }
  
  func populateMasterPic () {
    self.masterPicURL = self.steps[self.steps.count-2].masterImageUri;
  }
  
  func populateDaysOfTravel(){
    self.daysOfTravel =  Int(abs((self.steps[self.steps.count-1].endTimestamp/86400) - (self.steps[0].startTimestamp/86400)))
  
    self.daysOfTravel = self.daysOfTravel == 0 ? 1 : self.daysOfTravel;
  }
  
  func populateDistanceTravelled() {
    self.distanceTravelled = self.steps[self.steps.count-1].distanceTravelled;
  }
  
  func populateDates() {
    self.startDate = TripUtils.getDateFromTimestamp(self.steps[0].startTimestamp);
    self.endDate = TripUtils.getDateFromTimestamp(self.steps[self.steps.count - 1].endTimestamp);
  }
  
  func populateLocation() {
    // TODO: Fix self, country visited is not first step, first step is home
    self.location = Region()
    self.location.latitude = self.steps[1].meanLatitude
    self.location.longitude = self.steps[2].meanLongitude
  }
  
  func populateTemperature() {
    self.temperature = self.steps[1].temperature;
  }
  
  func populateTitle(countries: [String], places: [String]){
    var tripName = "";
    if(countries.count == 1) {
      // Only home country, use places
      var index = 0;
      for place in places {
        if(index == 0) {
          tripName = place
        }
        else {
          tripName += ", " + place
        }
        if(index == 2)  {
          break;
        }
        index += 1;
      }
    }
    else {
      var i = 0;
      for country in countries {
        if(i == 0) {
          tripName += country
        }
        else {
          tripName += ", " + country
        }
        i += 1;
      }
    }
    self.tripName = tripName
  }
}
