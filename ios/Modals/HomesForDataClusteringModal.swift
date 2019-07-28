//
//  HomesForDataClusteringModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 13/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class HomesForDataClusteringModal: Object {
  dynamic var name: String = ""
  dynamic var timestamp: Int64 = 0
  dynamic var latitude: Float64 = 0
  dynamic var longitude: Float64 = 0
  
  override static func primaryKey() -> String? {
    return "timestamp"
  }
  
  func CloneDictionary(dict: [String:Any]) {
    self.name = dict["name"] as? String ?? ""
    self.timestamp = dict["timestamp"] as? Int64 ?? 0
    self.latitude = dict["latitude"] as? Float64 ?? 0
    self.longitude = dict["longitude"] as? Float64 ?? 0
  }
  
  func GetAsDictionary() -> [String:Any] {
    var dict: [String:Any] = [:]
    dict["name"] = self.name;
    dict["timestamp"] = self.timestamp;
    dict["latitude"] = self.latitude;
    dict["longitude"] = self.longitude;
    
    return dict;
  }
  
}

