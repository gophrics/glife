package com.beerwithai.glimpse.Engine;

import com.beerwithai.glimpse.Engine.Modals.HomeDataModal;
import com.beerwithai.glimpse.Engine.Modals.ProfileModal;
import com.beerwithai.glimpse.Engine.Modals.Region;
import com.beerwithai.glimpse.Engine.Modals.StepModal;
import com.beerwithai.glimpse.Engine.Modals.TripModal;
import com.beerwithai.glimpse.Engine.Providers.AuthProvider;
import com.beerwithai.glimpse.Engine.Utils.AuthUtils;
import com.beerwithai.glimpse.Engine.Utils.TripUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

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
                    callback.resolve(dbData.get(0).GetAsDictionary());
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
                WritableArray response = new WritableNativeArray();
                for(int i = 0; i < dbData3.size(); i++) {
                    response.pushMap(dbData3.get(i).GetAsDictionary());
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

    @ReactMethod
    public void getHomeData(Promise callback) {
        Realm db = Realm.getDefaultInstance();
        RealmResults<HomeDataModal> dbResult = db.where(HomeDataModal.class).findAll();

        WritableArray promiseArray = Arguments.createArray();
        for(int i = 0; i < dbResult.size(); i++) {
            promiseArray.pushMap(dbResult.get(i).GetAsDictionary());
        }

        callback.resolve(promiseArray);
    }

    @ReactMethod
    public void setHomeData(ArrayList<Map<String, Object>> homeData, Promise callback) {
        Realm db = Realm.getDefaultInstance();
        RealmResults<HomeDataModal> dbResults = db.where(HomeDataModal.class).findAll();

        db.beginTransaction();
        db.delete(HomeDataModal.class);
        db.commitTransaction();

        for(int i = 0; i < homeData.size(); i++) {
            HomeDataModal homeDataModal = new HomeDataModal();
            homeDataModal.CloneDictionary(homeData.get(i));
            db.beginTransaction();
            db.copyToRealm(homeDataModal);
            db.commitTransaction();
        }
    }

    @ReactMethod
    public void getTripData(String op, String profileId, String tripId, Promise callback) {
        Realm db = Realm.getDefaultInstance();

        switch(op) {
            case "all":
                RealmResults<TripModal> dbResults = db.where(TripModal.class).equalTo("tripId", tripId).findAll();
                if(dbResults.size() > 0) {
                    callback.resolve(dbResults.get(0));
                } else {
                    callback.resolve(false);
                }
                break;
            case "steps":
                RealmResults<StepModal> dbResults2 = db.where(StepModal.class).equalTo("tripId", tripId).findAll();
                if(dbResults2.size() == 0) {
                    callback.resolve(false);
                    break;
                }

                WritableArray steps = new WritableNativeArray();

                for(int i = 0; i < dbResults2.size(); i++) {
                    steps.pushMap(dbResults2.get(i).GetAsDictionary());
                }
                callback.resolve(steps);
                break;
            default:
                callback.resolve(false);
                break;
        }
    }

    @ReactMethod
    public void getStepData(String op, String profileId, String tripId, int stepId, Promise callback) {

        Realm db = Realm.getDefaultInstance();
        RealmResults<StepModal> dbresult = db.where(StepModal.class).equalTo("tripId", tripId).equalTo("stepId", stepId).findAll();
        if(dbresult.size() > 0) {
            switch(op) {
                case "images":
                    ArrayList<String> resolveResult = new ArrayList<String>();
                    for(int i = 0; i < dbresult.get(i).images.size(); i++) {
                        resolveResult.add(dbresult.get(i).images.get(i));
                    }
                    callback.resolve(resolveResult);
                    break;
                default:
                    callback.resolve(false);
                    break;
            }
        } else {
            callback.resolve(false);
        }
    }

    @ReactMethod
    public void InitializeEngine(Promise callback) {
        boolean result = Engine.EngineInstance.Initialize(this.context);
        callback.resolve(result);
    }


    // API Calls

    @ReactMethod
    public void getCoordinatesFromLocation(String location, Promise callback) {
        try {
            ArrayList<Region> arr = TripUtils.getCoordinatesFromLocation(location);
            WritableArray result = new WritableNativeArray();

            for(int i = 0; i < arr.size(); i++) {
                result.pushMap(arr.get(i).GetAsDictionary());
            }

            callback.resolve(arr);
        } catch (Exception e) {
            e.printStackTrace();
            callback.reject(e);
        }
    }

    @ReactMethod
    public void Register(String email, String phone, String password, Promise callback) {
        try {
            String AuthToken = AuthUtils.Register(email, phone, password);
            AuthProvider.SetAuthToken(AuthToken);
            callback.resolve(true);
        } catch (Exception e) {
            callback.reject(e);
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void Login(String email, String password, Promise callback) {
        try {
            String AuthToken = AuthUtils.Login(email, password);
            AuthProvider.SetAuthToken(AuthToken);
            callback.resolve(true);
        } catch (Exception e) {
            callback.reject(e);
            e.printStackTrace();
        }
    }


    ReactApplicationContext context;

    public ExposedAPI(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "ExposedAPI";
    }
}
