package com.beerwithai.glimpse.Engine.Providers;

import com.beerwithai.glimpse.Engine.Modals.*;
import io.realm.Realm;
import io.realm.RealmResults;

public class DatabaseProvider {

    public static void ClearAllTrips() {
        Realm db = Realm.getDefaultInstance();

        try {
            db.beginTransaction();
            RealmResults<TripModal> dbObjects = db.where(TripModal.class).findAll();
            dbObjects.deleteAllFromRealm();
            RealmResults<StepModal> dbObjects2 = db.where(StepModal.class).findAll();
            dbObjects2.deleteAllFromRealm();
            db.commitTransaction();
        } finally {
            db.close();
        }
    }

    public static void UpdateDBWithTrips(TripModal[] trips) {
        Realm db = Realm.getDefaultInstance();

        try {
            for (int i = 0; i < trips.length; i++) {
                TripModal dbObject = db.where(TripModal.class).equalTo("tripId", trips[i].tripId).findFirst();
                if (dbObject != null) { //TODO: Check if this is the case
                    db.beginTransaction();
                    dbObject.CopyConstructor(trips[i]);
                    db.commitTransaction();
                } else {
                    db.beginTransaction();
                    db.copyToRealm(trips[i]);
                    db.commitTransaction();
                }
            }
        } finally {
            db.close();
        }

    }

    public static void UpdateDBWithSteps(StepModal[] steps) {
        Realm db = Realm.getDefaultInstance();

        try {
            for (int i = 0; i < steps.length; i++) {
                StepModal dbObject = db.where(StepModal.class).equalTo("tripId", steps[i].tripId).equalTo("stepId", steps[i].stepId).findFirst();
                if (dbObject != null) { //TODO: Check if this is the case
                    db.beginTransaction();
                    dbObject.CopyConstructor(steps[i]);
                    db.commitTransaction();
                } else {
                    db.beginTransaction();
                    db.copyToRealm(steps[i]);
                    db.commitTransaction();
                }
            }
        } catch(Exception e) {

        }
    }

    public static void UpdateDBWithHomesForDataClustering(HomesForDataClusteringModal[] homes) {
        Realm db = Realm.getDefaultInstance();

        try {
            db.beginTransaction();
            db.where(HomesForDataClusteringModal.class).findAll().deleteAllFromRealm();
            for(int i = 0; i < homes.length; i++) {
                db.copyToRealm(homes[i]);
            }
            db.commitTransaction();
        } catch (Exception e) {

        }
    }

    public static HomesForDataClusteringModal[] GetHomesForDataClustering() {
        Realm db = Realm.getDefaultInstance();

        try {
            RealmResults<HomesForDataClusteringModal> dbResults = db.where(HomesForDataClusteringModal.class).findAll();
            HomesForDataClusteringModal[] results = new HomesForDataClusteringModal[dbResults.size()];
            for(int i = 0; i < dbResults.size(); i++) {
                results[i] = dbResults.get(i);
            }
            return results;
        } catch (Exception e) {
            return null;
        }
    }


}
