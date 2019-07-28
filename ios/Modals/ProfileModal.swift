//
//  ProfileModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class Country: Object {
  dynamic var country: String = "";
}

@objcMembers
class ProfileModal : Object {
  dynamic var profileId: String = "randomGeneratedId"
  dynamic var countriesVisited: List<Country> = List<Country>()
  dynamic var percentageWorldTravelled: Float = 0
  
  // Profile stuff
  dynamic var coverPicURL: String = "https://cms.hostelworld.com/hwblog/wp-content/uploads/sites/2/2017/08/girlgoneabroad.jpg"
  dynamic var profilePicURL: String = "https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg"
  dynamic var name: String = ""
  dynamic var email: String = ""
  dynamic var password: String = ""
  
  func GetAsDictionary() -> [String:Any] {
    var dict: [String:Any] = [:]
    
    dict["profileId"] = self.profileId;
    dict["countriesVisited"] = self.countriesVisited;
    dict["percentageWorldTravelled"] = self.percentageWorldTravelled;
    dict["coverPicURL"] = self.coverPicURL;
    dict["profilePicURL"] = self.profilePicURL;
    dict["name"] = self.name;
    dict["email"] = self.email;
    dict["password"] = self.password;
    
    return dict;
  }
  
  override static func primaryKey() -> String? {
    return "profileId"
  }
}
