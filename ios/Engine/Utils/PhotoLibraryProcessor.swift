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

@objc(PhotoLibraryProcessor)
class PhotoLibraryProcessor: NSObject {
  
  @objc func getPhotosFromLibrary(_ callback: RCTResponseSenderBlock) -> Void {
    let allPhotos = PHAsset.fetchAssets(with: .image, options: PHFetchOptions())
    var arrayOfPHAsset : [[String: Any]] = []
    allPhotos.enumerateObjects({(object: AnyObject!,
      count: Int,
      stop: UnsafeMutablePointer<ObjCBool>) in
      
      if object is PHAsset{
        let asset = object as! PHAsset
        if(asset.location?.coordinate.latitude != nil) {
          arrayOfPHAsset.append([
            "image": [
              "uri": "ph://" + asset.localIdentifier,
              "timestamp": asset.creationDate?.timeIntervalSince1970
            ],
            "location": [
              "latitude": asset.location?.coordinate.latitude,
              "longitude": asset.location?.coordinate.longitude
            ]
            ])
        }
      }
    })
    callback([arrayOfPHAsset])
  }
}
