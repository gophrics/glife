//
//  ImageDataModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class ImageDataModal: Object {
  @objc dynamic var location: Region = Region()
  @objc dynamic var image: String = ""
  @objc dynamic var timestamp: Int64 = 0
}
