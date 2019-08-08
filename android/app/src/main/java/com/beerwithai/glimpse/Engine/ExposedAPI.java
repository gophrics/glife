package com.beerwithai.glimpse.Engine;

import com.beerwithai.glimpse.Engine.Modals.ProfileModal;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Map;

import javax.annotation.Nonnull;

import io.realm.Realm;
import io.realm.RealmResults;

public class ExposedAPI extends ReactContextBaseJavaModule {

    @ReactMethod
    public void getProfileData(String param, String profileId, Promise callback) {
        Realm db = Realm.getDefaultInstance();
        switch(param) {
            case "all":
                RealmResults<ProfileModal> dbData = db.where(ProfileModal.class).findAll();
                if(dbData.size() > 0) {
                    callback.resolve(dbData.get(0));
                } else {
                    callback.resolve(false);
                }
                break;
            case "name":
                RealmResults<ProfileModal> dbData2 = db.where(ProfileModal.class).findAll();
                if(dbData2.size() > 0) {
                    callback.resolve(dbData2.get(0).name);
                } else {
                    callback.resolve(false);
                }
                break;
            case "trips":
                RealmResults<ProfileModal> dbData3 = db.where(ProfileModal.class).findAll();
                ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
                for(int i = 0; i < dbData3.size(); i++) {
                    response.add(dbData3.get(i).GetAsDictionary());
                }
                callback.resolve(response);
                break;
            default:
                callback.resolve(null);
        }
    }


    @ReactMethod
    public void setProfileData(Map<String, Object> value, String param, String profileId, Promise callback) {
        Realm db = Realm.getDefaultInstance();
        switch(param) {
            case "name":
                RealmResults<ProfileModal> data = db.where(ProfileModal.class).findAll();
                ProfileModal profile = data.get(0);

                if(profile != null) {
                    db.beginTransaction();
                    profile.name = String.valueOf(value.get("name"));
                    db.copyFromRealm(profile);
                    db.commitTransaction();
                } else {
                    db.beginTransaction();
                    profile = new ProfileModal();
                    profile.name = String.valueOf(value.get("name"));
                    db.copyToRealm(profile);
                    db.commitTransaction();
                }
                break;
            default: break;
        }

        callback.resolve(true);
    }


    


    @Nonnull
    @Override
    public String getName() {
        return "ExposedAPI";
    }
}
