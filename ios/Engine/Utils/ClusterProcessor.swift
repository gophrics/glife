//
//  ClusterProcessor.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 10/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

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
      if(ClusterProcessor.EarthDistance(item, firstItem) < 10) {
        // We divide based on time
        if(item.timestamp <= firstTimestamp + 8.64e7) {
          _stepCluster[_it].push(item)
        } else {
          firstTimestamp = item.timestamp
          _stepCluster.push([item])
          _it++;
        }
      } else {
        // Else we divide based on distance
        firstTimestamp = item.timestamp
        firstItem = item;
        _stepCluster.push([item])
        _it++;
      }
    }
    
    for cluster in _stepCluster {
      var _step = ClusterProcessor.convertClusterToStep(cluster)
      if(_step.stepId != -1) {
        stepResult.push(_step)
      }
    }
    
    stepResult.sort((a, b) => {
      return a.endTimestamp < b.endTimestamp;
    })
    
    var i = 100;
    var previousStep: StepModal = StepModal();
    var distanceTravelled = 0
    for step in stepResult {
      step.stepId = i
      if(i > 100) {
        
        var _m = ClusterModal()
        _m.latitude = step.meanLatitude
        _m.longitude = step.meanLongitude
        
        var _n = ClusterModal()
        _n.latitude = previousStep.meanLatitude
        _n.longitude = previousStep.meanLongitude
        distanceTravelled += ClusterProcessor.EarthDistance(_m , _n).round(.down)
      }
      step.distanceTravelled = distanceTravelled;
      step.description = "Description goes here...";
      i += 100;
      previousStep = step;
    }
    
    return stepResult;
  }
  
  static func RunMasterClustering(clusterData: [ClusterModal], homes: [Int64: String]) -> [[ClusterModal]] {
  
    var trips: [[ClusterModal]] = []
    var trip: [ClusterModal] = []
  
    clusterData.sort((a, b) => {
      return a.timestamp < b.timestamp
    })
  
    var prevData: ClusterModal = clusterData[0];
    for data in clusterData {
      // If distance from home is more than 40 km
      if(ClusterProcessor.EarthDistance(homes[(data.timestamp/8.64e4).round(.down)], data) > 40
        // Noise filtering, if two pictures are taken 7 days apart, consider it a new trip
        && (ClusterProcessor.TimeDistance(data, prevData) < 8.64e4*7)) {
        trip.push(data)
      } else if(trip.length > 0){
          // If more than 3 photo were taken for the trip, it's officially considered a trip
          if(trip.length > 3) {
            trips.push(trip)
          }
          trip = []
      }
      prevData = data
    }
  
    if(trip.length > 0) {
      trips.push(trip)
    }
    return trips;
  }
  
  static func EarthDistance(p: ClusterModal, q: ClusterModal) -> Int64 {
    if(p == nil || q == nil) {
      return 0;
    }
    var lat2 = q.latitude;
    var lat1 = p.latitude;
    var lon2 = q.longitude;
    var lon1 = p.longitude;
  
    var R: Float64 = 6371; // km
    var dLat = ClusterProcessor.deg2rad(lat2 - lat1);
    var dLon = ClusterProcessor.deg2rad(lon2 - lon1);
    var a = sin(dLat / 2) * sin(dLat / 2) +
    cos(ClusterProcessor.deg2rad(lat1)) * Math.cos(ClusterProcessor.deg2rad(lat2)) * sin(dLon / 2) * sin(dLon / 2);
    var c = 2 * atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * Int64(c);
    return d;
  }
  
  static func convertClusterToStep(cluster: [ClusterModal]) -> StepModal {
    if(cluster.count == 0) {
      var _step = StepModal()
      _step.stepId = -1
      return _step
    }
    
    var latitudeSum = 0;
    var longitudeSum = 0;
    var imageUris: [String] = []
    var markers: [Region] = []
    
    cluster.sort((a, b) => {
      return a.timestamp < b.timestamp;
    })
    
    for item in cluster {
      latitudeSum += item.latitude;
      longitudeSum += item.longitude;
      imageUris.append(item.image);
      var _r = Region()
      _r.latitude = item.latitude;
      _r.longitude = item.longitude;
      markers.append(_r)
    }
    
    var _step: StepModal = StepModal()
    _step.meanLatitude = latitudeSum/cluster.count;
    _step.meanLongitude = longitudeSum/cluster.count;
    _step.markers = markers;
    _step.startTimestamp = cluster[0].timestamp;
    _step.endTimestamp = cluster[cluster.count - 1].timestamp
    _step.imageUris = imageUris
    _step.masterImageUri = imageUris[0];
    var _r = Region()
    _r.latitude = _step.meanLatitude
    _r.longitude = _step.meanLongitude
    _step.masterMarker = _r
    
    return _step;
  }

  static func deg2rad(deg: Float64) {
    return deg * (Double.pi/180)
  }
}
