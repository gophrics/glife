//
//  HomeDataModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class HomeDataModal: Object {
  dynamic var name: String = ""
  dynamic var timestamp: Double = 0
  dynamic var latitude: Float64 = 0
  dynamic var longitude: Float64 = 0
  
  
  func CloneDictionary(dict: [String:Any]) {
    self.name = dict["name"] as? String ?? ""
    self.timestamp = dict["timestamp"] as? TimeInterval ?? 0
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

