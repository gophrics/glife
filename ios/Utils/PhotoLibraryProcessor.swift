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
          _el.timestamp = Int64(asset.creationDate?.timeIntervalSince1970 ?? 0)
          arrayOfPHAsset.append(_el)
        }
      }
    })
    
    print("Dump: " + String(allPhotos.count))
    print("Dump2: " + String(arrayOfPHAsset.count))
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
  
  
  static func GenerateTripFromPhotos(clusterData: [ClusterModal], homesForDataClustering: List<HomesForDataClusteringModal>, endTimestamp: Int64) throws -> [TripModal] {
    
    let trips = ClusterProcessor.RunMasterClustering(clusterData: clusterData, homes: homesForDataClustering);
    var tripResult: [TripModal] = [];
    
    print("Dump: " + String(trips.count))
    if (trips.count == 0) {
      throw EngineError.coreEngineError(message: "No trips found")
    }
    
    for trip in trips {
      let _trip = trip.sorted(by: { $0.timestamp < $1.timestamp })
      let _steps: [StepModal] = ClusterProcessor.RunStepClustering(trip: _trip);
      let __trip = PhotoLibraryProcessor.PopulateTripModalData(steps: _steps, tripId: TripUtils.GenerateTripId(), homesDataForClustering: homesForDataClustering);
      tripResult.append(__trip);
    }
    
    tripResult = tripResult.sorted(by: {$0.endDate > $1.endDate})
    
    print("Dump 3: " + String(tripResult.count))
    return tripResult
  }
  
  
  static func PopulateTripModalData(steps: [StepModal], tripId: String, homesDataForClustering: List<HomesForDataClusteringModal>) -> TripModal {
    let tripResult: TripModal = TripModal();
    let homeStep = homesDataForClustering[Int(steps[0].startTimestamp / 86400) - 1]
    homeStep.timestamp = (steps[0].startTimestamp - 86400)
    
    let homeStepCluster = ClusterModal()
    homeStepCluster.latitude = homeStep.latitude
    homeStepCluster.longitude = homeStep.longitude
    homeStepCluster.timestamp = homeStep.timestamp
    
    var _stepsForTrip: [StepModal] = []
    
    let _stepModal: StepModal = ClusterProcessor.convertClusterToStep(cluster: [homeStepCluster])
    _stepModal.location = "Home";
    _stepModal.stepId = 0;
    _stepModal.tripId = tripId;
    _stepsForTrip.append(_stepModal);
    
    var i = 0;
    var countries: [String] = []
    var places: [String] = []
    
    for step in steps {
      
      let _p = ClusterModal()
      _p.latitude = step.meanLatitude;
      _p.longitude = step.meanLongitude;
      
      let _q = ClusterModal()
      _q.latitude = steps[i].meanLatitude;
      _q.longitude = steps[i].meanLongitude;

      step.distanceTravelled = (steps[i].distanceTravelled + ClusterProcessor.EarthDistance(p: _p, q: _q))
      step.tripId = tripId;
      _stepsForTrip.append(step);
      i += 1;
    }
    
    let homeStep2 = homesDataForClustering[Int(steps[steps.count - 1].endTimestamp / 86400) + 1]
    homeStep2.timestamp = (steps[steps.count - 1].endTimestamp + 86400)
    
    let homeStep2Cluster = ClusterModal()
    homeStep2Cluster.latitude = homeStep2.latitude
    homeStep2Cluster.longitude = homeStep2.longitude
    homeStep2Cluster.timestamp = homeStep2.timestamp
    
    let _stepModal2: StepModal = ClusterProcessor.convertClusterToStep(cluster: [homeStep2Cluster])
    _stepModal2.location = "Home";
    _stepModal.tripId = tripId;
    
    let _p = ClusterModal()
    _p.latitude = _stepModal.meanLatitude
    _p.longitude = _stepModal.meanLongitude
    
    let _q = ClusterModal()
    _q.latitude = _stepsForTrip[i].meanLatitude
    _q.longitude = _stepsForTrip[i].meanLongitude
    
    _stepModal2.distanceTravelled = (_stepsForTrip[_stepsForTrip.count - 2].distanceTravelled + ClusterProcessor.EarthDistance(p: _p, q: _q))
    _stepModal2.stepId = 10000

    _stepsForTrip.append(_stepModal2)
    
    // Load locations
    for step in _stepsForTrip {
      let result = TripUtils.getLocationFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)
      
      step.location = result
    
      if (countries.firstIndex(of: result) == nil) {
        countries.append(result)
      }
      if (places.firstIndex(of: step.location) == nil) {
        places.append(step.location)
      }
      var _obj = Country()
      _obj.country = result
      tripResult.countryCode.append(_obj)

      // Showing current weather now
      step.temperature = String(TripUtils.getWeatherFromCoordinates(latitude: step.meanLatitude, longitude: step.meanLongitude)) + "ºC"
    }
    
    tripResult.tripId = tripId;
    //tripResult.populateAll();
    //tripResult.populateTitle(countries: countries, places: places);

    PhotoLibraryProcessor.UpdateDBWithSteps(steps: _stepsForTrip)
    return tripResult
  }
  
  static func UpdateDBWithSteps(steps: [StepModal]) {
    let db = try! Realm()
    for step in steps {
      let dbObjects = db.objects(StepModal.self).filter{ $0.tripId == step.tripId && $0.stepId == step.stepId }
      if let obj = dbObjects.first {
        try! db.write {
          obj.CopyConstructor(step: step)
        }
      } else {
        try! db.write {
          db.add(step)
        }
      }
    }
  }
}
