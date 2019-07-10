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
}
