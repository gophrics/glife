//
//  TripUtils.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

var ServerURLWithoutEndingSlash = Constants.ServerURL

class TripUtils {
  static var TOTAL_TO_LOAD = 100;
  static var FINISHED_LOADING = 0;
  static var LAST_TRIP_PRESS = 0;
  
  static func GenerateTripId() -> String {
    return String((Int.random(in: 0..<100)*100000))
  }
  
  static func getWeatherFromCoordinates(latitude: Float64, longitude: Float64) -> Int {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchweatherbylocation"
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData

    var result = 0
    let semaphore = DispatchSemaphore(value: 0)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result = Int(Int64((responseJSON["main"] as! [String:Any])["temp"] as! Float64 - 273.15))
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    
    return result
  }
  
  static func getCountryCodeFromCoordinates(latitude: Float64, longitude: Float64) -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchcoordinates"
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    var result: String = ""
    let semaphore = DispatchSemaphore(value: 0)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        if((responseJSON["address"] as! [String:Any])["country_code"] != nil) {
          result = (responseJSON["address"] as! [String:Any])["country_code"] as! String
        }
        else {
          result = (responseJSON["address"] as! [String:Any])["country_code"] as! String
        }
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    
    return result
  }
  
  
  static func getLocationFromCoordinates(latitude: Float64, longitude: Float64) -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchcoordinates"
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData

    var result: String = ""
  
    let semaphore = DispatchSemaphore(value: 0)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if var responseJSON = responseJSON as? [String: Any] {
        if let address = responseJSON["address"] as? [String:Any] {
          if let state = address["state"] as? String {
            result = state
          } else if let county = address["county"] as? String {
            result = county
          }
        }
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    return result
  }
  
  static func getCoordinatesFromLocation(location: String) -> [Region] {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchlocation"
    let body: [String: Any] = [
      "location": location
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    var result: [Region] = []
    
    let semaphore = DispatchSemaphore(value: 0)
    let task = URLSession.shared.dataTask(with: request) { data, response, error in

      guard let data = data, error == nil else {
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [[String: Any]] {
        for _res in responseJSON {
          let _result = Region()
          _result.name = _res["display_name"] as! String
          _result.latitude = Float64(_res["lat"] as! String)!
          _result.longitude = Float64(_res["lon"] as! String)!
          result.append(_result)
        }
      }
      semaphore.signal()
    }
    
    task.resume()
    semaphore.wait()
    
    return result
  }
  
  static func GetTripUploadData(trip: TripModal) -> [String: Any] {
    return [:]
  }
  
  static func SaveTrip(trip: TripModal) -> Void {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/savetrip"
    let body: [String: Any] = [
      "trip": TripUtils.GetTripUploadData(trip: trip)
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Bearer " + AuthProvider.Token, forHTTPHeaderField: "Authorization")
    
    URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [[String: Any]] {
      }
    }
  }
  
  static func GetTrip(tripId: String, profileId: String) -> TripModal {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/gettrip"
    let body: [String: Any] = [
      "tripId": tripId,
      "profileId": profileId
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Bearer " + AuthProvider.Token, forHTTPHeaderField: "Authorization")
    
    let result = TripModal()
    URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        //result.CopyConstructor(trip: responseJSON)
      }
    }
    
    return result
  }
  
  static func GetTripCheckSumServer(tripId: String) -> String{
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/gettriphash"
    let body: [String: Any] = [
      "tripId": tripId
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Bearer " + AuthProvider.Token, forHTTPHeaderField: "Authorization")
    
    var result = ""
    URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result = responseJSON["Hash"] as! String
      }
    }
    
    return result
  }
  
  
  static func getDateFromTimestamp(timestamp: Int64) -> String {
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(abbreviation: "GMT") //Set timezone that you want
    dateFormatter.locale = NSLocale.current
    dateFormatter.dateFormat = "dd-MM-yyy" //Specify your format that you want
    let strDate = dateFormatter.string(from: Date(timeIntervalSince1970: TimeInterval(timestamp)))
    return strDate
  }
}
