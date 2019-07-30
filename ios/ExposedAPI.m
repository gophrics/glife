//
//  ExposedAPI.m
//  Glimpse
//
//  Created by Nitin Issac Joy on 12/07/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ExposedAPI, NSObject)

 RCT_EXTERN_METHOD(getProfileData: (NSString)param profileId:(NSString)profileId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(setProfileData: (NSDictionary)value param:(NSString)param profileId:(NSString)profileId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(getHomeData: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(setHomeData: (NSArray)homeData resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(getCoordinatesFromLocation: (NSString)location resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(getTripData: (NSString)op profileId:(NSString)profileId tripId:(NSString)tripId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

 RCT_EXTERN_METHOD(getStepData: (NSString)op profileId:(NSString)profileId tripId:(NSString)tripId stepId:(NSInteger)stepId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

  RCT_EXTERN_METHOD(addNewTrip: (NSString)tripName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

  RCT_EXTERN_METHOD(InitializeEngine: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(GetTotalToLoad: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(GetTotalLoaded: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(GetImageBeingLoaded: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
