package com.beerwithai.glimpse.Engine.Modals;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.realm.RealmList;
import io.realm.RealmObject;

public class ProfileModal extends RealmObject {
    public String profileId;
    public RealmList<String> countriesVisited;
    public Float percentageWorldTravelled;
    public String coverPicURL;
    public String profilePicURL;
    public String name;
    public String email;
    public String password;

    public Map<String, Object> GetAsDictionary() {
        Map<String, Object> _m = new HashMap<String, Object>();
        _m.put("profileId", this.profileId);
        ArrayList<String> countriesVisited = new ArrayList<String>();
        for(String country: countriesVisited) {
            countriesVisited.add(country);
        }
        _m.put("countriesVisited", countriesVisited);
        _m.put("percentageWorldTravelled", this.percentageWorldTravelled);
        _m.put("coverPicURL", this.coverPicURL);
        _m.put("profilePicURL", this.profilePicURL);
        _m.put("name", this.name);
        _m.put("email", this.email);
        _m.put("password", this.password);

        return _m;
    }
}