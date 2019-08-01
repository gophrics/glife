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

}
