//
//  StepModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class Image: Object {
  dynamic var image: String = "";
}

class StepModal : Object {
  dynamic var stepId: Int = 0
  dynamic var tripId: String = ""
  dynamic var profileId: String = ""
  dynamic var stepName: String = ""
  dynamic var meanLatitude: Float64 = 0
  dynamic var meanLongitude: Float64 = 0
  dynamic var location: String = ""
  dynamic var startTimestamp: Int64 = 0
  dynamic var endTimestamp: Int64 = 0
  dynamic var images: List<Image> = List<Image>()
  dynamic var markers: List<Region> = List<Region>()
  dynamic var masterImageUri: String = ""
  dynamic var masterMarker: Region = Region()
  dynamic var distanceTravelled: Int = 0
  dynamic var desc: String = ""
  dynamic var temperature: String = ""
  dynamic var masterImageBase64: String = ""
  dynamic var imageBase64: [String] = []
}
