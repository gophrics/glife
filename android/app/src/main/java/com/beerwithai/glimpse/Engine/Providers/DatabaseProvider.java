package com.beerwithai.glimpse.Engine.Providers;

import com.beerwithai.glimpse.Engine.Modals.*;

import java.util.ArrayList;

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

    public static void UpdateDBWithTrips(ArrayList<TripModal> trips) {
        Realm db = Realm.getDefaultInstance();

        try {
            for (int i = 0; i < trips.size(); i++) {
                TripModal dbObject = db.where(TripModal.class).equalTo("tripId", trips.get(i).tripId).findFirst();
                if (dbObject != null) { //TODO: Check if this is the case
                    db.beginTransaction();
                    dbObject.CopyConstructor(trips.get(i));
                    db.commitTransaction();
                } else {
                    db.beginTransaction();
                    db.copyToRealm(trips.get(i));
                    db.commitTransaction();
                }
            }
        } finally {
            db.close();
        }

    }

    public static void UpdateDBWithSteps(ArrayList<StepModal> steps) {
        Realm db = Realm.getDefaultInstance();

        try {
            for (int i = 0; i < steps.size(); i++) {
                StepModal dbObject = db.where(StepModal.class).equalTo("tripId", steps.get(i).tripId).equalTo("stepId", steps.get(i).stepId).findFirst();
                if (dbObject != null) { //TODO: Check if this is the case
                    db.beginTransaction();
                    dbObject.CopyConstructor(steps.get(i));
                    db.commitTransaction();
                } else {
                    db.beginTransaction();
                    db.copyToRealm(steps.get(i));
                    db.commitTransaction();
                }
            }
        } catch(Exception e) {

        }
    }

    public static void UpdateDBWithHomesForDataClustering(ArrayList<HomesForDataClusteringModal> homes) {
        Realm db = Realm.getDefaultInstance();

        try {
            db.beginTransaction();
            db.where(HomesForDataClusteringModal.class).findAll().deleteAllFromRealm();
            for(int i = 0; i < homes.size(); i++) {
                db.copyToRealm(homes.get(i));
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
