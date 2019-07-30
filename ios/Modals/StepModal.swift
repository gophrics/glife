//
//  StepModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class Image: Object {
  dynamic var image: String = "";
}

@objcMembers
class StepModal : Object {
  dynamic var stepId: Int = 0
  dynamic var tripId: String = ""
  dynamic var profileId: String = ""
  dynamic var stepName: String = ""
  dynamic var meanLatitude: Float64 = 0
  dynamic var meanLongitude: Float64 = 0
  dynamic var startTimestamp: Int64 = 0
  dynamic var endTimestamp: Int64 = 0
  dynamic var images: List<Image> = List<Image>()
  dynamic var markers: List<Region> = List<Region>()
  dynamic var masterImage: String = ""
  // Dont know why this should be optional debug later
  dynamic var masterMarker: Region? = Region()
  dynamic var distanceTravelled: Int = 0
  dynamic var desc: String = ""
  dynamic var temperature: String = ""
  
  func GetAsDictionary() -> [String:Any] {
    var dict: [String:Any] = [:]
    
    dict["stepId"] = self.stepId;
    dict["tripId"] = self.tripId;
    dict["profileId"] = self.profileId;
    dict["stepName"] = self.stepName;
    dict["meanLatitude"] = self.meanLatitude;
    dict["meanLongitude"] = self.meanLongitude;
    dict["startTimestamp"] = self.startTimestamp;
    dict["endTimestamp"] = self.endTimestamp;
    dict["masterImage"] = self.masterImage;
    dict["masterMarker"] = self.masterMarker;
    dict["distanceTravelled"] = self.distanceTravelled;
    dict["desc"] = self.desc;
    dict["temperature"] = self.temperature;
    dict["numberOfPicturesTaken"] = self.images.count;
    
    return dict;
  }
}
