package com.beerwithai.glimpse.Engine.Modals;

import java.util.HashMap;
import java.util.Map;

public class Region {
    public Float latitude;
    public Float longitude;
    public String name;

    public Map<String, Object> GetAsDictionary() {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("latitude", this.latitude);
        result.put("longitude", this.longitude);
        result.put("name", this.name);
        return result;
    }
}
