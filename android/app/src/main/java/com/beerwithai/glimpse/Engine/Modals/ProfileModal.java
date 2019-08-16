package com.beerwithai.glimpse.Engine.Modals;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.realm.RealmList;
import io.realm.RealmObject;

public class ProfileModal extends RealmObject {
    public String profileId = "randomGeneratedId";
    public RealmList<String> countriesVisited = new RealmList<String>();
    public Float percentageWorldTravelled = Float.valueOf(0);
    public String coverPicURL = "";
    public String profilePicURL = "";
    public String name = "";
    public String email = "";
    public String password = "";

    public WritableMap GetAsDictionary() {
        WritableMap _m = new WritableNativeMap();
        _m.putString("profileId", this.profileId);
        WritableArray countriesVisited = new WritableNativeArray();
        for(String country: this.countriesVisited) {
            countriesVisited.pushString(country);
        }
        _m.putArray("countriesVisited", countriesVisited);
        _m.putDouble("percentageWorldTravelled", this.percentageWorldTravelled);
        _m.putString("coverPicURL", this.coverPicURL);
        _m.putString("profilePicURL", this.profilePicURL);
        _m.putString("name", this.name);
        _m.putString("email", this.email);
        _m.putString("password", this.password);

        return _m;
    }
}