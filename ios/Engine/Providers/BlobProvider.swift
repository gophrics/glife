//
//  BlobProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class BlobProvider {
  var homeData: [HomeDataModal] = []
  var homesForDataClustering: [Int64: String] = [:]
  var startTimestamp: Int64 = 0
  var endTimestamp: Int64 = 0
  var blobLoaded: Bool = false;
  var engineBlobLoaded: Bool = false;
  var email: String = "";
  var password: String = "";
  
  init() {
    
  }
  
}
