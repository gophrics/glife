package com.beerwithai.glimpse.Engine.Modals;

import java.util.List;

import io.realm.RealmList;

public class TripModal extends RealmList {
    public String profileId;
    public String tripId;
    public String tripName;
    public RealmList<String> countryCode;
    public String temperature;
    public Integer daysOfTravel;
    public Integer distanceTravelled;
}