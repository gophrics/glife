//
//  Region.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

@objc
class Region: NSObject {
  @objc dynamic var latitude: Float64 = 0
  @objc dynamic var longitude: Float64 = 0
}
