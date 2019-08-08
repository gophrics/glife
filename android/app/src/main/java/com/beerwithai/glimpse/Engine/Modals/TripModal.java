package com.beerwithai.glimpse.Engine.Modals;

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

    public Map<String, Object> GetAsDictionary() {
        Map<String, Object> obj = new HashMap<String, Object>();
        obj.put("profileId", this.profileId);
        obj.put("tripId", this.tripId);
        obj.put("tripName", this.tripName);
        obj.put("countryCode", this.countryCode);
        obj.put("temperature", this.temperature);
        obj.put("daysOfTravel", this.daysOfTravel);
        obj.put("distanceTravelled", this.distanceTravelled);
        obj.put("startDate", this.startDate);
        obj.put("endDate", this.endDate);
        obj.put("masterImage", this.masterImage);
        obj.put("isPublic", this.isPublic);
        obj.put("syncComplete", this.syncComplete);
        return obj;
    }
}