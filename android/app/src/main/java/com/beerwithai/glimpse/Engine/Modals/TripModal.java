package com.beerwithai.glimpse.Engine.Modals;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;
import java.util.Map;

import io.realm.RealmList;
import io.realm.RealmObject;

public class TripModal extends RealmObject {
    public String profileId = "";
    public String tripId = "";
    public String tripName = "";
    public RealmList<String> countryCode = new RealmList<>();
    public String temperature = "";
    public Integer daysOfTravel = 0;
    public Integer distanceTravelled = 0;
    public String startDate = "";
    public String endDate = "";
    public String masterImage = "";
    public boolean isPublic = false;
    public boolean syncComplete  = false;

    public void CopyConstructor(TripModal trip) {
        this.tripName = trip.tripName;
        this.countryCode = trip.countryCode;
        this.temperature = trip.temperature;
        this.daysOfTravel = trip.daysOfTravel;
        this.distanceTravelled = trip.distanceTravelled;
        this.startDate = trip.startDate;
        this.endDate = trip.endDate;
        this.masterImage = trip.masterImage;
        this.isPublic = trip.isPublic;
        this.syncComplete = trip.syncComplete;
    }

    public WritableMap GetAsDictionary() {
        WritableMap obj = new WritableNativeMap();
        obj.putString("profileId", this.profileId);
        obj.putString("tripId", this.tripId);
        obj.putString("tripName", this.tripName);

        WritableArray cc = new WritableNativeArray();
        for(String code: this.countryCode) {
            cc.pushString(code);
        }
        obj.putArray("countryCode", cc);
        obj.putString("temperature", this.temperature);
        obj.putInt("daysOfTravel", this.daysOfTravel);
        obj.putInt("distanceTravelled", this.distanceTravelled);
        obj.putString("startDate", this.startDate);
        obj.putString("endDate", this.endDate);
        obj.putString("masterImage", this.masterImage);
        obj.putBoolean("isPublic", this.isPublic);
        obj.putBoolean("syncComplete", this.syncComplete);
        return obj;
    }
}