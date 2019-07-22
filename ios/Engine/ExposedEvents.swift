
//
//  ExposedEvents.swift
//  Glimpse
//
//  Created by Nitin Issac Joy on 12/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


@objc(ExposedEvents)
class ExposedEvents: RCTEventEmitter {

    @objc
    static func GetTotalToLoad() {
        sendEvent(withName:"getTotalToLoad", body: ["totalToLoad", 10]) //TODO
    }
    
    @objc
    static func GetTotalLoaded() {
        sendEvent(withName:"getTotalLoaded", body:["totalLoaded", 1]) //TODO
    }
    
    @objc
    static func GetImageBeingLoaded() {
        sendEvent(withName:"getImageBeingLoaded", body:["imageBeingLoaded", "imageuri"]) //TODO
    }
    
    // we need to override this method and
    // return an array of event names that we can listen to
    override func supportedEvents() -> [String]! {
        return ["getTotalToLoad", "getTotalLoaded", "getImageBeingLoaded"]
    }
    
    // you also need to add the override attribute
    // on these methods
    override func constantsToExport() {}
    override static func requiresMainQueueSetup() {}
}
