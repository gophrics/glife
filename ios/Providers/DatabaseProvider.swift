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
}

var Database = DatabaseProvider()