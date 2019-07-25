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
  dynamic var timestamp: Int64 = 0
  dynamic var latitude: Float64 = 0
  dynamic var longitude: Float64 = 0
  
  func CloneDictionary(dict: [String:Any]) {
    self.name = dict["name"] as? String ?? ""
    self.timestamp = dict["timestamp"] as? Int64 ?? 0
    self.latitude = dict["latitude"] as? Float64 ?? 0
    self.longitude = dict["longitude"] as? Float64 ?? 0
  }
  
  override static func primaryKey() -> String? {
    return "timestamp"
  }
}

class HomeDataObject: Object {
  dynamic var HomeData: List<HomeDataModal> = List<HomeDataModal>()
}
