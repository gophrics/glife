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
  
  static func getWeatherFromCoordinates(latitude: number, longitude: number) -> String {
    let urlString = ServerURLWithoutEndingSlash + '/api/v1/travel/searchweatherbylocation'
    let body: [String: Any] = [
      "latitude": latitude,
      "longitude": longitude
    ]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.httpBody = jsonData
    request.addValue("Token \(AuthProvider.Token)", forHTTPHeaderField: "Authorization")

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
}
