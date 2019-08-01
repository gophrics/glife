package com.beerwithai.glimpse.Engine.Modals;


import java.util.List;

import io.realm.RealmList;
import io.realm.RealmObject;

public class StepModal extends RealmObject {
    public String profileId;
    public String tripId;
    public Integer stepId;
    public Float meanLatitude;
    public Float meanLongitude;
    public Double startTimestamp;
    public Double endTimestamp;
    public RealmList<String> images;
    public RealmList<Region> markers;
    public String masterImage;
    public Integer distanceTravelled;
    public String desc;
    public Integer temperature;
}