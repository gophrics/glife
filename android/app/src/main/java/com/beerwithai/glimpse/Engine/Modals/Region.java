package com.beerwithai.glimpse.Engine.Modals;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;
import java.util.Map;

public class Region {
    public Float latitude;
    public Float longitude;
    public String name;

    public WritableMap GetAsDictionary() {
        WritableMap result = new WritableNativeMap();
        result.putDouble("latitude", this.latitude);
        result.putDouble("longitude", this.longitude);
        result.putString("name", this.name);
        return result;
    }
}
