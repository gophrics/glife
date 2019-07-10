//
//  ProfileModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class ProfileModal {
  var trips: [TripModal]
  var countriesVisited: [String]
  var percentageWorldTravelled: Float
  var coverPicURL: String
  
  // Profile stuff
  var profilePicURL: String
  var profileId: String
  var name: String
  
  init() {
    self.trips = [];
    self.countriesVisited = []
    self.percentageWorldTravelled = 0
    self.coverPicURL = ""
    self.profilePicURL = ""
    self.profileId = ""
    self.name = ""
  }
}
