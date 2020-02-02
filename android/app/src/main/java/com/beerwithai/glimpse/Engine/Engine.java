package com.beerwithai.glimpse.Engine;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomeDataModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.Region;
import com.beerwithai.glimpse.Engine.Modals.TripModal;
import com.beerwithai.glimpse.Engine.Providers.DatabaseProvider;
import com.beerwithai.glimpse.Engine.Utils.PhotoLibraryProcessor;
import com.beerwithai.glimpse.Engine.Utils.TripUtils;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Date;

public class Engine {
    public static Engine EngineInstance = new Engine();

    public void GenerateHomeData(ArrayList<HomeDataModal> homeData) throws Exception {
        if(homeData.size() == 0) {
            throw new Exception("No homes as input found");
        }

        Date today = new Date();

        ArrayList<HomesForDataClusteringModal> homesForDataClusteringModals = new ArrayList<HomesForDataClusteringModal>();
        for(int i = 0; i < (int)(today.getTime()/86400); i++) {
            homesForDataClusteringModals.add(new HomesForDataClusteringModal());
        }

        int currentTimestamp = (int)(today.getTime()/86400);
        for(int i = 0; i < homeData.size(); i++) {
            try {
                ArrayList<Region> coordinates = TripUtils.getCoordinatesFromLocation(homeData.get(i).name); // TODO: Bug
                Region _region = coordinates.get(0);

                while(currentTimestamp >= homeData.get(i).timestamp/86400) {
                    homesForDataClusteringModals.get((currentTimestamp)).timestamp = (double)currentTimestamp;
                    homesForDataClusteringModals.get((currentTimestamp)).name = homeData.get(i).name;
                    homesForDataClusteringModals.get((currentTimestamp)).latitude = homeData.get(i).latitude;
                    homesForDataClusteringModals.get((currentTimestamp)).longitude = homeData.get(i).longitude;

                    currentTimestamp -= 1;
                }
            } catch (Exception e) {
                // TODO: Handle exception
            }
        }

        DatabaseProvider.UpdateDBWithHomesForDataClustering(homesForDataClusteringModals);
    }

    public boolean Initialize(ReactApplicationContext context) {
        DatabaseProvider.ClearAllTrips(); // Remove this, all logic in react native
        ArrayList<HomeDataModal> homeDataArray = DatabaseProvider.GetHomeData();
        try {
            this.GenerateHomeData(homeDataArray);
        } catch (Exception e) {

        }

        ArrayList<ClusterModal> _cluster = PhotoLibraryProcessor.getPhotosFromLibrary(context);
        _cluster =  PhotoLibraryProcessor.PopulateImageProperties(_cluster);

        if(_cluster.size() == 0) {
            return true;
        }

        try {
            ArrayList<TripModal> trips = PhotoLibraryProcessor.GenerateTripFromPhotos(_cluster);
            DatabaseProvider.UpdateDBWithTrips(trips);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}