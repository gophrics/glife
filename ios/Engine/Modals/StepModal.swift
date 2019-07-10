//
//  StepModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


class StepModal {
  var stepId: Int
  var stepName: String
  var meanLatitude: Float64
  var meanLongitude: Float64
  var location: String
  var startTimestamp: Int64
  var endTimestamp: Int64
  var imageUris: [String]
  var markers: [Region]
  var masterImageUri: String
  var masterMarker: Region
  var distanceTravelled: Int64
  var description: String
  var temperature: String
  var masterImageBase64: String
  var imageBase64: [String]
  
  init() {
    self.stepId = 0;
    self.meanLatitude = 0;
    self.meanLongitude = 0;
    self.location = "";
    self.startTimestamp = 0;
    self.endTimestamp = 0;
    self.imageUris = [];
    self.markers = [];
    self.masterImageUri = "";
    self.masterMarker = Region()
    self.distanceTravelled = 0;
    self.description = "";
    self.temperature = "";
    self.stepName = "";
    self.masterImageBase64 = "";
    self.imageBase64 = [];
  }
}
