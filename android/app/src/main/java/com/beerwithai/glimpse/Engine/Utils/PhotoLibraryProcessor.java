package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.Region;
import com.beerwithai.glimpse.Engine.Modals.StepModal;
import com.beerwithai.glimpse.Engine.Modals.TripModal;
import com.beerwithai.glimpse.Engine.Providers.DatabaseProvider;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

import io.realm.RealmList;

public class PhotoLibraryProcessor {

    public static String GenerateTripNameFromSteps(ArrayList<StepModal> steps) {
        ArrayList<String> locations = new ArrayList<String>();
        locations.add("");
        locations.add("Home");

        String result = "";

        for(int i = 0; i < steps.size(); i++) {
            if(locations.indexOf(steps.get(i).stepName) != -1) { //TODO: Confirm if index is not found it's returning -1
                locations.add(steps.get(i).stepName);
                result += steps.get(i).stepName;
            }

            if(locations.size() > 4) {
                break;
            }
        }

        result = result.substring(0, result.lastIndexOf(','));
        return result;
    }

    public static TripModal PopulateTripWithSteps(TripModal trip, ArrayList<StepModal> steps) {
        trip.daysOfTravel = Integer.valueOf((int)(steps.get(steps.size() -1).endTimestamp - steps.get(0).startTimestamp)/86400);
        trip.startDate = ""; // TODO: Generate date from startTImestamp of steps
        trip.endDate = ""; // TODO: Generate date from endTimestamp of steps
        trip.masterImage = steps.get(steps.size() - 2).masterImage;
        trip.isPublic = false;
        trip.syncComplete = false;
        trip.temperature = steps.get(steps.size() - 2).temperature;
        trip.tripName = PhotoLibraryProcessor.GenerateTripNameFromSteps(steps);
        trip.distanceTravelled = steps.get(steps.size() - 1).distanceTravelled;
        trip.daysOfTravel = Integer.valueOf((int)(steps.get(steps.size() - 1).endTimestamp - steps.get(0).startTimestamp));
        return trip;
    }

    public static StepModal GetHomeStepFromTimestamp(ArrayList<HomesForDataClusteringModal> homesForDataClustering, double timestamp, String tripId, Integer stepId) {
        HomesForDataClusteringModal homeStep = homesForDataClustering[]

        StepModal _stepModal = new StepModal();
        _stepModal.stepName = "Home";
        _stepModal.stepId = stepId;
        _stepModal.tripId = tripId;
        _stepModal.meanLatitude = homeStep.latitude;
        _stepModal.meanLongitude = homeStep.longitude;
        _stepModal.startTimestamp = timestamp;
        _stepModal.endTimestamp = timestamp;

        Region markerRegion = new Region();
        markerRegion.latitude = homeStep.latitude;
        markerRegion.longitude = homeStep.longitude;

        _stepModal.markers = new RealmList<Region>();
        _stepModal.markers.add(markerRegion);

        return _stepModal;
    }

    public static TripModal PopulateTripModalData(ArrayList<StepModal> steps, String tripId, ArrayList<HomesForDataClusteringModal> homesForDataClustering) {
        TripModal tripResult = new TripModal();
        ArrayList<StepModal> _stepsForTrip = new ArrayList<StepModal>();
        ArrayList<String> countries = new ArrayList<String>();
        ArrayList<String> places = new ArrayList<String>();

        _stepsForTrip.add(PhotoLibraryProcessor.GetHomeStepFromTimestamp(homesForDataClustering, steps.get(0).startTimestamp, tripId, 0));

        for(int i = 1; i < _stepsForTrip.size(); i++) {
            try {
                String result = TripUtils.getLocationFromCoordinates(_stepsForTrip.get(i).meanLatitude, _stepsForTrip.get(i).meanLongitude);
                _stepsForTrip.get(i).stepName = result;
                _stepsForTrip.get(i).tripId = tripId;
                _stepsForTrip.get(i).stepId = i * 100;

                if (countries.indexOf(result) == -1) { // TODO: Check if indexOf gives -1 if not found
                    countries.add(result);
                    tripResult.countryCode.add(result);
                }

                if (places.indexOf(_stepsForTrip.get(i).stepName) == -1) {
                    places.add(_stepsForTrip.get(i).stepName);
                }

                _stepsForTrip.get(i).temperature = String.valueOf(TripUtils.getWeatherFromCoordinates(_stepsForTrip.get(i).meanLatitude, _stepsForTrip.get(i).meanLongitude));
                _stepsForTrip.get(i).distanceTravelled = steps.get(i - 1).GetDistanceBetween(_stepsForTrip.get(i));
            } catch (Exception e) {
                // TODO: Handle exception
            }
        }

        StepModal _stepModal2 = PhotoLibraryProcessor.GetHomeStepFromTimestamp(homesForDataClustering, steps.get(steps.size() - 1).endTimestamp, tripId, (steps.size() - 1)*100);
        _stepModal2.distanceTravelled = steps.get(steps.size() - 1).distanceTravelled + steps.get(steps.size() - 1).GetDistanceBetween(_stepModal2);
        _stepsForTrip.add(_stepModal2);

        tripResult.tripId = tripId;
        tripResult = PhotoLibraryProcessor.PopulateTripWithSteps(tripResult, _stepsForTrip);

        DatabaseProvider.UpdateDBWithSteps(_stepsForTrip);

        return tripResult;
    }

    public static ArrayList<TripModal> GenerateTripFromPhotos(ArrayList<ClusterModal> clusterData) throws Exception {
        ArrayList<HomesForDataClusteringModal> homesForDataClustering = DatabaseProvider.GetHomesForDataClustering();
        ArrayList<ArrayList<ClusterModal>> trips = ClusterProcessor.RunMasterClustering(clusterData, homesForDataClustering);

        if (trips.size() == 0) {
            throw new Exception("ABC"); //TODO: Write exceptions
        }

        ArrayList<TripModal> tripResult = new ArrayList<TripModal>();

        for(int i = 0; i < trips.size(); i++) {
            ArrayList<ClusterModal> _trip = trips.get(i);
            Collections.sort(_trip, new CompareClusterByTimestamp());
            ArrayList<StepModal> _unsortedSteps = ClusterProcessor.RunStepClustering(_trip);
            Collections.sort(_unsortedSteps, new CompareByTimestamp());
            TripModal trip = PhotoLibraryProcessor.PopulateTripModalData(_unsortedSteps, TripUtils.GenerateTripId(), homesForDataClustering);
            tripResult.add(trip);
        }
        Collections.sort(tripResult, new CompareTripsByTimestamp());
        return tripResult;
    }


}

class CompareTripsByTimestamp implements Comparator<TripModal> {
    public int compare(TripModal a, TripModal b) {
        return a.startDate.compareTo(b.startDate);
    }
}
