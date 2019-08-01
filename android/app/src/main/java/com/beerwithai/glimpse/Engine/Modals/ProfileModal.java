package com.beerwithai.glimpse.Engine.Modals;

import java.util.List;

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
}