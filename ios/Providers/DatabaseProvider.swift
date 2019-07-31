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
  var db = try! Realm()

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
}

var Database = DatabaseProvider()
