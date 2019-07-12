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
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result = Int(Int64((responseJSON["main"] as! [String:Any])["temp"] as! Float64 - 273.15))
      }
    }
    
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
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        if((responseJSON["address"] as! [String:Any])["county"] != nil) {
          result = (responseJSON["address"] as! [String:Any])["county"] as! String
        }
        else {
          result = (responseJSON["address"] as! [String:Any])["state_district"] as! String
        }
      }
    }
    
    return result
  }
  
  static func getCoordinatesFromLocation(location: String) -> Region {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchlocation"
    let body: [String: Any] = [
      "location": location
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    var result = Region()
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [[String: Any]] {
        var _result = Region()
        _result.latitude = (responseJSON as! [[String:Any]])[0]["lat"] as! Float64
        _result.longitude = (responseJSON as! [[String:Any]])[0]["lon"] as! Float64
        result = _result
      }
    }
    return result
  }
  
  static func GetTripUploadData(trip: TripModal) -> String {
    
  }
  
  static func SaveTrip(trip: TripModal) -> Void {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/savetrip"
    let body: [String: Any] = [
      "trip": GetTripUploadData(trip: trip)
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: body)
    var request = URLRequest(url: URL(string: urlString)!)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Bearer " + AuthProvider.Token, forHTTPHeaderField: "Authorization")
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
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
    
    var result = TripModal()
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        result.CopyConstructor(responseJSON)
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
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
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
}
