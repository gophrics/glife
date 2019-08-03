package com.beerwithai.glimpse.Engine.Modals;

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
}