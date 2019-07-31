//
//  DatabaseProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class DatabaseProvider {
  
  static func ClearAllTrips() {
    let db = try! Realm()
    let dbObjects = db.objects(TripModal.self)
    for object in dbObjects {
      try! db.write {
        db.delete(object)
      }
    }
    let dbObjects2 = db.objects(StepModal.self)
    for object in dbObjects2 {
      try! db.write {
        db.delete(object)
      }
    }
  }
  
  static func UpdateDBWithTrips(trips: [TripModal]) {
    let db = try! Realm();
    
    for trip in trips{
      let dbResult = db.objects(TripModal.self).filter{ $0.tripId == trip.tripId }
      if let _trip = dbResult.first {
        try! db.write {
          _trip.CopyConstructor(trip: trip)
        }
      } else {
        try! db.write {
          db.add(trip)
        }
      }
    }
  }
  
  static func UpdateDBWithSteps(steps: [StepModal]) {
    let db = try! Realm()
    for step in steps {
      let dbObjects = db.objects(StepModal.self).filter{ $0.tripId == step.tripId && $0.stepId == step.stepId }
      if let obj = dbObjects.first {
        try! db.write {
          obj.CopyConstructor(step: step);
        }
      } else {
        try! db.write {
          db.add(step)
        }
      }
    }
  }
  
  static func UpdateDBWithHomesForDataClustering(homes: [HomesForDataClusteringModal]) {
    let db = try! Realm()
    let dbresult = db.objects(HomesForDataClusteringModal.self)
    try! db.write {
      db.delete(dbresult)
    }
    
    let dbData: List<HomesForDataClusteringModal> = List<HomesForDataClusteringModal>()
    for home in homes {
      dbData.append(home)
    }
    try! db.write {
      db.add(dbData)
    }
  }
  
  static func GetHomesForDataClustering() -> [HomesForDataClusteringModal] {
    let db = try! Realm()
    let dbresult = db.objects(HomesForDataClusteringModal.self)
    
    var returnArray: [HomesForDataClusteringModal] = []
    for res in dbresult {
      let home = HomesForDataClusteringModal()
      home.CopyConstructor(home: res)
      returnArray.append(home)
    }
    
    return returnArray
  }
}

