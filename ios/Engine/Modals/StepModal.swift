//
//  StepModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class StepModal {
  @objc dynamic var stepId: Int = 0
  @objc dynamic var stepName: String = ""
  @objc dynamic var meanLatitude: Float64 = 0
  @objc dynamic var meanLongitude: Float64 = 0
  @objc dynamic var location: String = ""
  @objc dynamic var startTimestamp: Int64 = 0
  @objc dynamic var endTimestamp: Int64 = 0
  @objc dynamic var imageUris: [String] = []
  @objc dynamic var markers: [Region] = []
  @objc dynamic var masterImageUri: String = ""
  @objc dynamic var masterMarker: Region = Region()
  @objc dynamic var distanceTravelled: Int64 = 0
  @objc dynamic var description: String = ""
  @objc dynamic var temperature: String = ""
  @objc dynamic var masterImageBase64: String = ""
  @objc dynamic var imageBase64: [String] = []
  
}
