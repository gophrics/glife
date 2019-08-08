package com.beerwithai.glimpse.Engine.Modals;

import java.util.HashMap;
import java.util.Map;

import io.realm.RealmObject;

public class HomeDataModal extends RealmObject {
    public String name;
    public Double timestamp;
    public Float latitude;
    public Float longitude;

    public Map<String, Object> GetAsDictionary() {
        Map<String, Object> obj = new HashMap<String, Object>();
        obj.put("name", this.name);
        obj.put("timestamp", this.timestamp);
        obj.put("latitude", this.latitude);
        obj.put("longitude", this.longitude);
        return obj;
    }

    public void CloneDictionary(Map<String, Object> obj) {
        this.name = String.valueOf(obj.get("name"));
        this.timestamp = Double.parseDouble(String.valueOf(obj.get("timestamp")));
        this.latitude = Float.parseFloat(String.valueOf(obj.get("latitude")));
        this.longitude = Float.parseFloat(String.valueOf(obj.get("longitude")));
    }
}