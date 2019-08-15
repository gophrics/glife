package com.beerwithai.glimpse.Engine.Modals;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;
import java.util.Map;

import io.realm.RealmObject;

public class HomeDataModal extends RealmObject {
    public String name;
    public Double timestamp;
    public Float latitude;
    public Float longitude;

    public WritableMap GetAsDictionary() {
        WritableMap obj = new WritableNativeMap();
        obj.putString("name", this.name);
        obj.putDouble("timestamp", this.timestamp);
        obj.putDouble("latitude", this.latitude);
        obj.putDouble("longitude", this.longitude);
        return obj;
    }

    public void CloneDictionary(Map<String, Object> obj) {
        this.name = String.valueOf(obj.get("name"));
        this.timestamp = Double.parseDouble(String.valueOf(obj.get("timestamp")));
        this.latitude = Float.parseFloat(String.valueOf(obj.get("latitude")));
        this.longitude = Float.parseFloat(String.valueOf(obj.get("longitude")));
    }
}