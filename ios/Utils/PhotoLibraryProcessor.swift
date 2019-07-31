//
//  PhotoLibraryProcessor.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 09/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import CoreLocation
import Photos
import RealmSwift

@objc(PhotoLibraryProcessor)
class PhotoLibraryProcessor: NSObject {
  
  static func getPhotosFromLibrary() -> [ClusterModal] {
    let allPhotos = PHAsset.fetchAssets(with: .image, options: PHFetchOptions())
    var arrayOfPHAsset : [ClusterModal] = []
    allPhotos.enumerateObjects({(object: AnyObject!,
      count: Int,
      stop: UnsafeMutablePointer<ObjCBool>) in
      
      if object is PHAsset{
        let asset = object as! PHAsset
        if(asset.location != nil && asset.creationDate != nil) {
          let _el: ClusterModal = ClusterModal()
          _el.image = "ph://" + asset.localIdentifier
          _el.latitude = asset.location?.coordinate.latitude ?? 0
          _el.longitude = asset.location?.coordinate.longitude ?? 0
          _el.timestamp = asset.creationDate?.timeIntervalSince1970 ?? 0
          arrayOfPHAsset.append(_el)
        }
      }
    })
    
    return arrayOfPHAsset
  }
  
  static func GetJPEGFromPHAsset(path: String) -> Data? {
    let asset: PHAsset? = PHAsset.fetchAssets(withLocalIdentifiers: [path], options: .none).firstObject
    if (asset != nil) {
      let retinaSquare = CGSize(width: 1000, height: 1000)
      var thumbnail: UIImage? = nil
      PHImageManager.default().requestImage(for: asset!, targetSize: retinaSquare, contentMode: .aspectFit, options: PHImageRequestOptions(), resultHandler: {(result, info)->Void in
        thumbnail = result!
      })
      if thumbnail != nil {
        return thumbnail!.jpegData(compressionQuality: 100)
      }
      return nil
    }
    return nil
  }
  
  
  static func GenerateTripFromPhotos(clusterData: [ClusterModal]) throws -> [TripModal] {
    
    let homesForDataClustering = DatabaseProvider.GetHomesForDataClustering()
    let trips = ClusterProcessor.RunMasterClustering(clusterData: clusterData, homes: homesForDataClustering);
    if (trips.count == 0) {
      throw EngineError.coreEngineError(message: "No trips found")
    }
    
    var tripResult: [TripModal] = [];
    
    var i = 0;
    for trip in trips {
      let _trip = trip.sorted(by: { $0.timestamp < $1.timestamp })
      let _unsortedSteps: [StepModal] = ClusterProcessor.RunStepClustering(trip: _trip);
      let __trip = PhotoLibraryProcessor.PopulateTripModalData(steps: _unsortedSteps.sorted(by: {$0.startTimestamp < $1.startTimestamp }), tripId: TripUtils.GenerateTripId(), homesDataForClustering: homesForDataClustering);
      tripResult.append(__trip);
      i += 1;
    }
    
    tripResult = tripResult.sorted(by: {$0.startDate < $1.startDate})
    
    return tripResult
  }
  
  
  static func PopulateTripModalData(steps: [StepModal], tripId: String, homesDataForClustering: [HomesForDataClusteringModal]) -> TripModal {
    print("DEBUG: "  + tripId)
    var tripResult: TripModal = TripModal();
    
    var i = 1;
    var _stepsForTrip: [StepModal] = []
    var countries: [String] = []
    var places: [String] = []
    
    _stepsForTrip.append(PhotoLibraryProcessor.GetHomeStepForTimestamp(homesDataForClustering: homesDataForClustering, timestamp: steps[0].startTimestamp, tripId: tripId, stepId: 0));
    
    // Load locations
    for step in steps {
      let result = TripUtils.getLocationFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)
      step.stepName = result
      step.tripId = tripId;
      step.stepId = i*100;
      
      if (countries.firstIndex(of: result) == nil) {
        countries.append(result)
      }
      
      if (places.firstIndex(of: step.stepName) == nil) {
        places.append(step.stepName)
      }
      
      let _obj = Country()
      _obj.country = result
      tripResult.countryCode.append(_obj)

      // Showing current weather now
      step.temperature = String(TripUtils.getWeatherFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)) + "ºC"
      step.distanceTravelled = steps[i-1].GetDistanceBetween(a: step)
      _stepsForTrip.append(step);
      i += 1;
    }
    
    let _stepModal2: StepModal = PhotoLibraryProcessor.GetHomeStepForTimestamp(homesDataForClustering: homesDataForClustering, timestamp: steps[steps.count - 1].endTimestamp, tripId: tripId, stepId: i*100)
    _stepModal2.distanceTravelled = steps[steps.count - 1].distanceTravelled + _stepsForTrip[_stepsForTrip.count - 1].GetDistanceBetween(a: _stepModal2)
    _stepsForTrip.append(_stepModal2)
    
    tripResult.tripId = tripId;
    tripResult = PhotoLibraryProcessor.PopulateTripWithSteps(trip: tripResult, steps: _stepsForTrip)
    DatabaseProvider.UpdateDBWithSteps(steps: _stepsForTrip)
    
    return tripResult
  }
  
  static func GetHomeStepForTimestamp(homesDataForClustering: [HomesForDataClusteringModal], timestamp: TimeInterval, tripId: String, stepId: Int) -> StepModal {
    
    let homeStep = homesDataForClustering[Int(timestamp / 86400) - 1]
    
    let _stepModal: StepModal = StepModal()
    _stepModal.stepName = "Home";
    _stepModal.stepId = stepId;
    _stepModal.tripId = tripId;
    _stepModal.meanLatitude = homeStep.latitude
    _stepModal.meanLongitude = homeStep.longitude
    _stepModal.startTimestamp = timestamp;
    _stepModal.endTimestamp = timestamp;
    
    var markerRegion = Region()
    markerRegion.latitude = homeStep.latitude;
    markerRegion.longitude = homeStep.longitude;
    
    _stepModal.markers = List<Region>()
    _stepModal.markers.append(markerRegion)
    
    return _stepModal
  }
  
  static func PopulateTripWithSteps(trip: TripModal, steps: [StepModal]) -> TripModal {
    trip.daysOfTravel = Int((steps[steps.count - 1].endTimestamp - steps[0].startTimestamp)/86400)
    var date = Date(timeIntervalSince1970: TimeInterval(steps[steps.count-1].endTimestamp))
    
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "dd-MM-yyyy"
    trip.endDate = dateFormatter.string(from: date);
    
    trip.masterImage = steps[steps.count-2].masterImage
    trip.isPublic = false;
    
    print("DEBUG: StartTimestamp: " + String(steps[0].startTimestamp))
    date = Date(timeIntervalSince1970: TimeInterval(steps[0].startTimestamp))
    trip.startDate = dateFormatter.string(from: date)
    trip.syncComplete = false;
    trip.temperature = steps[steps.count - 2].temperature;
  
    trip.tripName = PhotoLibraryProcessor.GenerateTripNameFromSteps(steps: steps)
    trip.distanceTravelled = steps[steps.count - 1].distanceTravelled;
    trip.daysOfTravel = Int((steps[steps.count - 1].endTimestamp - steps[0].startTimestamp)/86400)
    return trip;
  }
  
  static func GenerateTripNameFromSteps(steps: [StepModal]) -> String {
    var locations: [String] = ["", "Home"];
    var result: String = "";
    
    for step in steps{
      if let _ = locations.firstIndex(of: step.stepName) {
      
      } else {
        locations.append(step.stepName)
        result += step.stepName + ", ";
      }
      
      if locations.count > 4 {
        break;
      }
    }
    
    result = result.substring(to: result.lastIndex(of: ",") ?? String.Index(encodedOffset: result.count))
    return result;
  }
  
}
