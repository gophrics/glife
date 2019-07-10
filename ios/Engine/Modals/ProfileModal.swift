//
//  ProfileModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class ProfileModal {
  @objc dynamic var trips: [TripModal] = []
  @objc dynamic var countriesVisited: [String] = []
  @objc dynamic var percentageWorldTravelled: Float = 0
  
  // Profile stuff
  @objc dynamic var coverPicURL: String = ""
  @objc dynamic var profilePicURL: String = ""
  @objc dynamic var profileId: String = ""
  @objc dynamic var name: String = ""
  
}
