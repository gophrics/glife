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

    public void CopyConstructor(StepModal step) {
        this.meanLatitude = step.meanLatitude;
        this.meanLongitude = step.meanLongitude;
        this.startTimestamp = step.startTimestamp;
        this.endTimestamp = step.endTimestamp;
        this.images = step.images;
        this.markers = step.markers;
        this.masterImage = step.masterImage;
        this.distanceTravelled = step.distanceTravelled;
        this.desc = step.desc;
        this.temperature  = step.temperature;
    }
}