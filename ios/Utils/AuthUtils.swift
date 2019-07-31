//
//  AuthUtils.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 31/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class AuthUtils {
  
  static func Login(email: String, password: String) throws -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/profile/login"
    let body: [String: Any] = [
      "email": email,
      "password": password
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    var result: String = ""
    let semaphore = DispatchSemaphore(value: 0)
    var success: Bool = false;
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result = responseJSON["Token"] as! String
        success = true;
      } else {
        result = String(data: data, encoding: String.Encoding.ascii)!
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    
    if(!success) {
      throw APIError.GenericError(message: result)
    }
    return result
  }
  
  static func Register(email: String, phone:String, password: String) throws -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/profile/register"
    let body: [String: Any] = [
      "email": email,
      "phone": phone,
      "password": password
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    var result: String = ""
    let semaphore = DispatchSemaphore(value: 0)
    var success: Bool = false;
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result = responseJSON["Token"] as! String
        success = true
      } else {
        result = String(data: data, encoding: String.Encoding.ascii)!
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    
    if(!success) {
      throw APIError.GenericError(message: result)
    }
    return result
  }
}
