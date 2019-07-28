//
//  ClusterProcessor.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import RealmSwift

class ClusterProcessor {
  
  static func RunStepClustering(trip: [ClusterModal]) -> [StepModal] {
    if(trip.count == 0) {
       return [StepModal()]
    }
    
    var stepResult: [StepModal] = []
    var firstTimestamp: Int64 = trip[0].timestamp
    var firstItem: ClusterModal = trip[0]
    
    var _stepCluster: [[ClusterModal]] = []
    _stepCluster.append([])
    
    var _it: Int = 0
    
    for item in trip {
      // If distance between two modals are less than 10 km
      if(ClusterProcessor.EarthDistance(p: item, q: firstItem) < 10) {
        // We divide based on time
        if(item.timestamp <= firstTimestamp + 86400) {
          _stepCluster[_it].append(item)
        } else {
          firstTimestamp = item.timestamp
          _stepCluster.append([item])
          _it += 1;
        }
      } else {
        // Else we divide based on distance
        firstTimestamp = item.timestamp
        firstItem = item;
        _stepCluster.append([item])
        _it += 1;
      }
    }
    
    for cluster in _stepCluster {
      let _step = ClusterProcessor.convertClusterToStep(cluster: cluster)
      if(_step.stepId != -1) {
        stepResult.append(_step)
      }
    }
    
    stepResult = stepResult.sorted(by: { $0.endTimestamp < $1.endTimestamp } )
    
    var i = 100;
    var previousStep: StepModal = StepModal();
    var distanceTravelled = 0
    for step in stepResult {
      step.stepId = i
      if(i > 100) {
        
        let _m = ClusterModal()
        _m.latitude = step.meanLatitude
        _m.longitude = step.meanLongitude
        
        let _n = ClusterModal()
        _n.latitude = previousStep.meanLatitude
        _n.longitude = previousStep.meanLongitude
        distanceTravelled += ClusterProcessor.EarthDistance(p: _m , q: _n)
      }
      step.distanceTravelled = distanceTravelled;
      step.desc = "Description goes here...";
      i += 100;
      previousStep = step;
    }
    
    return stepResult;
  }
  
  static func RunMasterClustering(clusterData: [ClusterModal], homes: List<HomesForDataClusteringModal>) -> [[ClusterModal]] {
  
    var trips: [[ClusterModal]] = []
    var trip: [ClusterModal] = []
  
    var _clusterData = clusterData.sorted(by: { $0.timestamp < $1.timestamp })
  
    var prevData: ClusterModal = _clusterData[0];
    for data in _clusterData {
      let _clusterHomeData = ClusterModal()
      _clusterHomeData.latitude = homes[Int(data.timestamp/86400)].latitude
      _clusterHomeData.longitude = homes[Int(data.timestamp/86400)].longitude
      _clusterHomeData.timestamp = homes[Int(data.timestamp/86400)].timestamp
      
      // If distance from home is more than 40 km
      if(ClusterProcessor.EarthDistance(p: _clusterHomeData, q: data) > 40
        // Noise filtering, if two pictures are taken 7 days apart, consider it a new trip
        && (ClusterProcessor.TimeDistance(p: data, q: prevData) < 86400*7)) {
          trip.append(data)
      } else if(trip.count > 0){
          // If more than 3 photo were taken for the trip, it's officially considered a trip
          if(trip.count > 3) {
            trips.append(trip)
          }
          trip = []
      }
      prevData = data
    }
  
    if(trip.count > 0) {
      trips.append(trip)
    }
    return trips;
  }
  
  static func TimeDistance(p: ClusterModal, q: ClusterModal) -> Int64 {
    return abs(p.timestamp - q.timestamp)
  }
  
  static func EarthDistance(p: ClusterModal, q: ClusterModal) -> Int {
    
    let lat2 = q.latitude;
    let lat1 = p.latitude;
    let lon2 = q.longitude;
    let lon1 = p.longitude;
  
    let R: Float64 = 6371; // km
    let dLat = ClusterProcessor.deg2rad(deg: lat2 - lat1);
    let dLon = ClusterProcessor.deg2rad(deg: lon2 - lon1);
    let a = sin(dLat / 2) * sin(dLat / 2) +
      cos(ClusterProcessor.deg2rad(deg: lat1)) * cos(ClusterProcessor.deg2rad(deg: lat2)) * sin(dLon / 2) * sin(dLon / 2);
    let c = 2 * atan2(a.squareRoot(), (1 - a).squareRoot());
    let d = R * Float64(c);
    return Int(d);
  }
  
  static func convertClusterToStep(cluster: [ClusterModal]) -> StepModal {
    if(cluster.count == 0) {
      let _step = StepModal()
      _step.stepId = -1
      return _step
    }
    
    var latitudeSum: Float64 = 0;
    var longitudeSum: Float64 = 0;
    var imageUris: [String] = []
    var markers: [Region] = []
    
    var _cluster = cluster.sorted(by: { return $0.timestamp < $1.timestamp })
    
    for item in _cluster {
      latitudeSum += item.latitude;
      longitudeSum += item.longitude;
      imageUris.append(item.image);
      let _r = Region()
      _r.latitude = item.latitude;
      _r.longitude = item.longitude;
      markers.append(_r)
    }
    
    let _step: StepModal = StepModal()
    _step.meanLatitude = latitudeSum/Double(cluster.count);
    _step.meanLongitude = longitudeSum/Double(cluster.count);
    _step.markers = List<Region>()
    for marker in markers {
      _step.markers.append(marker)
    }
    _step.startTimestamp = _cluster[0].timestamp;
    _step.endTimestamp = _cluster[cluster.count - 1].timestamp
    _step.images = List<Image>()
    for image in imageUris {
      let _obj = Image()
      _obj.image = image
      _step.images.append(_obj)
    }
    _step.masterImage = imageUris[0];
    let _r = Region()
    _r.latitude = _step.meanLatitude
    _r.longitude = _step.meanLongitude
    _step.masterMarker = _r
    
    return _step;
  }

  static func deg2rad(deg: Float64) -> Float64 {
    return deg * (Double.pi/180)
  }
}
