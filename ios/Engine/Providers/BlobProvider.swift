//
//  BlobProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class EngineModal {
  @objc dynamic var homeData: [HomeDataModal] = []
  @objc dynamic var homesForDataClustering: [Int64: String] = [:]
  @objc dynamic var startTimestamp: Int64 = 0
  @objc dynamic var endTimestamp: Int64 = 0
  @objc dynamic var blobLoaded: Bool = false;
  @objc dynamic var engineBlobLoaded: Bool = false;
  @objc dynamic var email: String = "";
  @objc dynamic var password: String = "";
}

class BlobProvider {
  
  var Modal: EngineModal = EngineModal()
  
  init() {
    
  }
  
  func saveEngineData() {
    let currentEngineModal = Database.db.objects(EngineModal.self)
    try! Database.db.write {
      currentEngineModal = self.Modal
    }
  }
  
  func loadEngineData() {
    self.Modal = Database.db.objects(EngineModal.self)
  }
  
}
