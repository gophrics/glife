package com.beerwithai.glimpse.Engine.Modals;

import io.realm.RealmObject;

public class HomeDataModal extends RealmObject {
    public String name;
    public Double timestamp;
    public Float latitude;
    public Float longitude;

    public void GetAsDictionary() {
        
    }
}