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

    public void CopyConstructor(TripModal trip) {
        this.tripName = trip.tripName;
        this.countryCode = trip.countryCode;
        this.temperature = trip.temperature;
        this.daysOfTravel = trip.daysOfTravel;
        this.distanceTravelled = trip.distanceTravelled;
    }
}