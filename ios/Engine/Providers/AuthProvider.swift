//
//  AuthProvider.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class RegisterUserModal {
  var Phone: String = ""
  var Email: String = ""
  var Password: String = ""
}

class LoginUserModal {
  var Email: String = ""
  var Password: String = ""
}

class AuthProvider {
  
  static var Token: String = "";
  
  func setAuthToken(token: String) {
    AuthProvider.Token = token
  }
}
