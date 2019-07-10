//
//  TripModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class TripModal {
  var profileId: String
  var tripId: String
  var steps: [StepModal]
  var location : Region
  var tripName: String
  var countryCode: [String]
  var temperature : String
  var daysOfTravel: Int
  var distanceTravelled : Int
  var activities: [String]
  var startDate: String
  var endDate: String
  var masterPicURL: String
  var masterPicBase64: String
  var isPublic: Bool
  var syncComplete: Bool
  
  init() {
    self.profileId = ""
    self.tripId = "";
    self.steps = [];
    self.location = Region()
    self.temperature = ""
    self.daysOfTravel = 0
    self.distanceTravelled = 0
    self.activities = []
    self.startDate = ""
    self.endDate = ""
    self.tripName = ""
    self.countryCode = []
    self.masterPicURL = ""
    self.masterPicBase64 = ""
    self.isPublic = false
    self.syncComplete = false
  }
}
