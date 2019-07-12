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
    return String((Math.random()*10000000).round(.down))
  }
  
  static func GetTotalToLoad() {
    return TripUtils.TOTAL_TO_LOAD
  }
  
  static func GetFinishedLoading() {
    return TripUtils.FINISHED_LOADING
  }
  
  static func getWeatherFromCoordinates(latitude: Float64, longitude: Float64) -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchweatherbylocation"
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData

    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        return Int64(responseJSON.main.temp) - 273.15
      }
    }
  }
  
  static func getLocationFromCoordinates(latitude: Float64, longitude: Float64) -> String {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchcoordinates"
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData

    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        if(responseJSON.address.county != nil) {
          return responseJSON.address.county
        }
        else {
          responseJSON.address.state_district
        }
      }
    }
  }
  
  static func getCoordinatesFromLocation(location: String) -> Region {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/searchlocation"
    let body: [String: Any] = [
      "location": location
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        var _result = Region()
        _result.latitude = responseJSON[0].lat
        _result.longitude = responseJSON[0].lon
        return _result
      }
    }
  }
  
  static func GetTripUploadData(trip: TripModal) -> String {
    
  }
  
  static func SaveTrip(trip: TripModal) {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/savetrip"
    let body: [String: Any] = [
      "trip": GetTripUploadData(trip)
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Authorization", "Bearer " + AuthProvider.Token)
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        var _result = Region()
        _result.latitude = responseJSON[0].lat
        _result.longitude = responseJSON[0].lon
        return _result
      }
    }
  }
  
  static func GetTrip(tripId: String, profileId: String) -> TripModal {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/gettrip"
    let body: [String: Any] = [
      "tripId": tripId,
      "profileId": profileId
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Authorization", "Bearer " + AuthProvider.Token)
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        return responseJSON
      }
    }
  }
  
  static func GetTripCheckSumServer(tripId: String) {
    let urlString = ServerURLWithoutEndingSlash + "/api/v1/travel/gettriphash"
    let body: [String: Any] = [
      "tripId": tripId
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.setValue("Authorization", "Bearer " + AuthProvider.Token)
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      guard let data = data, error == nil else {
        print("No data")
        return
      }
      let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
      if let responseJSON = responseJSON as? [String: Any] {
        return responseJSON
      }
    }
  }
}
