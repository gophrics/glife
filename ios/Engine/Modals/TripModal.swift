//
//  TripModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class TripModal {
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
  
  
  func populateAll() {
    self.populateMasterPic();
    self.populateDaysOfTravel();
    self.populateDistanceTravelled();
    self.populateDates();
    self.populateLocation();
    self.populateTemperature();
  }
  
  func populateMasterPic () {
    self.masterPicURL = self.steps[self.steps.length-2].masterImageUri;
  }
  
  func populateDaysOfTravel(){
    self.daysOfTravel =  abs((self.steps[self.steps.length-1].endTimestamp/8.64e7) - Math.floor(self.steps[0].startTimestamp/8.64e7).round(.down))
  
    self.daysOfTravel = self.daysOfTravel == 0 ? 1 : self.daysOfTravel;
  }
  
  func populateDistanceTravelled() {
    self.distanceTravelled = self.steps[self.steps.length-1].distanceTravelled;
  }
  
  func populateDates() {
    self.startDate = TripUtils.getDateFromTimestamp(self.steps[0].startTimestamp);
    self.endDate = TripUtils.getDateFromTimestamp(self.steps[self.steps.length - 1].endTimestamp);
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
    if(countries.length == 1) {
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
        index++;
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
        i++;
      }
    }
    self.tripName = tripName
  }
}
