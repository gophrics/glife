//
//  ClusterModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class ClusterModal {
  var id: Int
  var latitude: Float64
  var longitude: Float64
  var timestamp: TimeInterval
  var image: String
  
  init() {
    self.id = 0;
    self.latitude = 0;
    self.longitude = 0;
    self.timestamp = 0;
    self.image = "";
  }
}
