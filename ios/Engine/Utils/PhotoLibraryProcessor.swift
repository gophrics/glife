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
  
  static func getPhotosFromLibrary(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> [PHAsset] {
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
    resolve(arrayOfPHAsset)
    return arrayOfPHAsset
  }
  
  static func convertImageToCluster(images: [ImageDataModal], endTimestamp: Int64) {
    var clusterData: [ClusterModal]  = [];
    for image in images {
      var _modal = ClusterModal()
      _modal.image = image.image;
      _modal.latitude = image.location.latitude;
      _modal.longitude = image.location.longitude;
      _modal.timestamp = image.timestamp;
      clusterData.append(_modal)
    }
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
        return UIImageJPEGRepresentation(thumbnail!, 100)
      }
      return nil
    }
    return nil
  }
  
  
}
