//
//  HomeDataModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class HomeDataModal: Object {
  dynamic var name: String = ""
  dynamic var timestamp: Int64 = 0
  dynamic var latitude: Float64 = 0
  dynamic var longitude: Float64 = 0
}
