//
//  BlobProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class EngineModal: Object {
  dynamic var homeData: List<HomeDataModal> = List<HomeDataModal>()
  dynamic var homesForDataClustering: List<HomeDataModal> = List<HomeDataModal>()
  dynamic var startTimestamp: Int64 = 0
  dynamic var endTimestamp: Int64 = 0
  dynamic var blobLoaded: Bool = false;
  dynamic var engineBlobLoaded: Bool = false;
  dynamic var email: String = "";
  dynamic var password: String = "";
}

class EngineBlob: Object {
  dynamic var profileData: ProfileModal = ProfileModal()
  dynamic var trips: List<TripModal> = List<TripModal>()
}

class BlobProvider {
  
  var Modal: EngineModal = EngineModal()
  var Blob: EngineBlob = EngineBlob()
  
  init() {
    self.loadEngineData()
  }
  
  func saveEngineData() {
    var currentEngineModal = Database.db.objects(EngineModal.self).first
    if(currentEngineModal != nil) {
      try! Database.db.write {
        currentEngineModal = self.Modal
      }
    } else {
      try! Database.db.write {
        Database.db.add(self.Modal)
      }
    }
  }
  
  func loadEngineData() {
    self.Modal = Database.db.objects(EngineModal.self).first!
  }
}
