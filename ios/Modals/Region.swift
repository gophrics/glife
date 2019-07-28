//
//  Region.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class Region: Object {
  dynamic var latitude: Float64 = 0
  dynamic var longitude: Float64 = 0
  dynamic var name: String = ""
  
  func GetAsDictionary() -> [String:Any] {
    var dict : [String:Any] = [:]
    dict["latitude"] = self.latitude
    dict["longitude"] = self.longitude
    dict["display_name"] = self.name
    return dict
  }
}
