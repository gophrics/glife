package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.StepModal;
import java.util.ArrayList;
import java.util.Comparator;

public class ClusterProcessor {

    public static ArrayList<StepModal> RunStepClustering(ClusterModal[] trip) {
        if(trip.length == 0) {
            return null;
        }

        ArrayList<StepModal> stepResult = new ArrayList<StepModal>();
        Double firstTimestamp = trip[0].timestamp;
        ClusterModal firstItem = trip[0];
        ArrayList<ArrayList<ClusterModal>> _stepCluster = new ArrayList<ArrayList<ClusterModal>>();
        _stepCluster.add(new ArrayList<ClusterModal>());
        Integer _it = 0;

        for(int i = 0; i < trip.length; i++) {
            if(ClusterProcessor.EarthDistance(trip[i], firstItem) < 10) {
                if(trip[i].timestamp <= firstTimestamp + 86400) {
                    _stepCluster.get(_it).add(trip[i]);
                } else {
                    firstTimestamp = trip[i].timestamp;
                    ArrayList<ClusterModal> t = new ArrayList<ClusterModal>();
                    t.add(trip[i]);
                    _stepCluster.add(t);
                    _it += 1;
                }
            } else {
                firstTimestamp = trip[i].timestamp;
                firstItem = trip[i];
                ArrayList<ClusterModal> t = new ArrayList<ClusterModal>();
                t.add(trip[i]);
                _stepCluster.add(t);
                _it += 1;
            }
        }

        for(int i = 0; i < _stepCluster.size(); i++) {
            StepModal step = ClusterProcessor.convertClusterToStep(_stepCluster[i]);
            if(step.stepId != -1) {
                stepResult.add(step);
            }
        }

        stepResult = stepResult.sort(comparator); // TODO: Define comparator

        int i = 100;
        StepModal previousStep = new StepModal();
        int distanceTravelled = 0;
        for(int i = 0; i < stepResult.size(); i++) {
            stepResult.get(i).stepId = i;
            if(i > 100) {
                ClusterModal _m = new ClusterModal();
                _m.latitude = stepResult.get(i).meanLatitude;
                _m.longitude = stepResult.get(i).meanLongitude;

                ClusterModal _n = new ClusterModal();
                _n.latitude = previousStep.meanLatitude;
                _n.longitude = previousStep.meanLongitude;

                distanceTravelled += ClusterProcessor.EarthDistance(_m, _n);
            }
            stepResult.get(i).distanceTravelled = distanceTravelled;
            stepResult.get(i).desc = "Description goes here...";
            i += 100;
            previousStep = stepResult.get(i);
        }

        return stepResult;
    }

    static ArrayList<ArrayList<ClusterModal>> RunMasterClustering(ArrayList<ClusterModal> clusterData, ArrayList<HomesForDataClusteringModal> homes) {
        ArrayList<ArrayList<ClusterModal>> trips = new ArrayList<ArrayList<ClusterModal>>();
        ArrayList<ClusterModal> trip = new ArrayList<ClusterModal>();

        ArrayList<ClusterModal> _clusterData = clusterData.sort(comparator); //TODO: Define comparator

        ClusterModal prevData = clusterData.get(0);

        for(int i = 0; i < clusterData.size(); i++) {
            ClusterModal _clusterHomeData  = new ClusterModal();
            _clusterHomeData.latitude = homes.get((int)(clusterData.get(i).timestamp/86400)).latitude;
            _clusterHomeData.longitude = homes.get((int)(clusterData.get(i).timestamp/86400)).longitude;
            _clusterHomeData.timestamp = homes.get((int)(clusterData.get(i).timestamp/86400)).timestamp;

            if(ClusterProcessor.EarthDistance(_clusterHomeData, clusterData.get(i)) > 40 && (ClusterProcessor.TimeDistance(clusterData.get(i), prevData) < 86400 * 7)) {
                trip.add(clusterData.get(i));
            } else if(clusterData.size() > 0) {
                if(clusterData.size() > 3) {
                    trips.add(trip);
                }
                trip = new ArrayList<ClusterModal>();
            }
            prevData = clusterData.get(i);
        }

        if(trip.size() > 0) {
            trips.add(trip);
        }

        return trips;
    }

    static Double TimeDistance(ClusterModal p, ClusterModal q) {
        return Math.abs(p.timestamp - q.timestamp);
    }

    static Integer EarthDistance(ClusterModal p, ClusterModal q) {
        double lat1 = p.latitude;
        double lat2 = q.latitude;
        double lon1 = q.longitude;
        double lon2 = q.longitude;

        double R = 6371;
        double dLat = ClusterProcessor.deg2rad(lat2 - lat1);
        double dLon = ClusterProcessor.deg2rad(lon2 - lon1);

        double a = Math.sin(dLat/2) * Math.sin(dLon/2) + Math.cos(ClusterProcessor.deg2rad(lat1)) * Math.cos(ClusterProcessor.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        double d = R * Float.valueOf(c);

        return (int)d;
    }

    static double deg2rad(double deg) {
        return deg * (PI/180) // TODO: Value PI
    }

    

}
