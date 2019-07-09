//
//  ImageDataModal.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class ImageDataModal {
  var location: Region
  var image: String
  var timestamp: Int64
  
  init() {
    self.location = Region();
    self.image = "";
    self.timestamp = 0;
  }
}
