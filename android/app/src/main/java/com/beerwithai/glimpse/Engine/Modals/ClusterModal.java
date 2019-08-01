package com.beerwithai.glimpse.Engine.Modals;

import io.realm.RealmObject;

public class ClusterModal extends RealmObject {
    public Integer id;
    public Float latitude;
    public Float longitude;
    public Double timestamp;
    public String image;
}