//
//  ProfileModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class Country: Object {
  dynamic var country: String = "";
}

class ProfileModal : Object {
  dynamic var countriesVisited: List<Country> = List<Country>()
  dynamic var percentageWorldTravelled: Float = 0
  
  // Profile stuff
  dynamic var coverPicURL: String = ""
  dynamic var profilePicURL: String = ""
  dynamic var profileId: String = ""
  dynamic var name: String = ""
}
