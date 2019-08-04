package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.Region;
import com.beerwithai.glimpse.Engine.Modals.StepModal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import io.realm.RealmList;

class CompareByTimestamp implements Comparator<StepModal> {
    public int compare(StepModal a, StepModal b) {
        return (int)(a.endTimestamp - b.endTimestamp);
    }
}

class CompareClusterByTimestamp implements  Comparator<ClusterModal> {
    public int compare(ClusterModal a, ClusterModal b) {
        return (int)(a.timestamp - b.timestamp);
    }
}

public class ClusterProcessor {


    public static ArrayList<StepModal> RunStepClustering(ArrayList<ClusterModal> trip) {
        if(trip.size() == 0) {
            return null;
        }

        ArrayList<StepModal> stepResult = new ArrayList<StepModal>();
        Double firstTimestamp = trip.get(0).timestamp;
        ClusterModal firstItem = trip.get(0);
        ArrayList<ArrayList<ClusterModal>> _stepCluster = new ArrayList<ArrayList<ClusterModal>>();
        _stepCluster.add(new ArrayList<ClusterModal>());
        Integer _it = 0;

        for(int i = 0; i < trip.size(); i++) {
            if(ClusterProcessor.EarthDistance(trip.get(i), firstItem) < 10) {
                if(trip.get(i).timestamp <= firstTimestamp + 86400) {
                    _stepCluster.get(_it).add(trip.get(i));
                } else {
                    firstTimestamp = trip.get(i).timestamp;
                    ArrayList<ClusterModal> t = new ArrayList<ClusterModal>();
                    t.add(trip.get(i));
                    _stepCluster.add(t);
                    _it += 1;
                }
            } else {
                firstTimestamp = trip.get(i).timestamp;
                firstItem = trip.get(i);
                ArrayList<ClusterModal> t = new ArrayList<ClusterModal>();
                t.add(trip.get(i));
                _stepCluster.add(t);
                _it += 1;
            }
        }

        for(int i = 0; i < _stepCluster.size(); i++) {
            StepModal step = ClusterProcessor.convertClusterToStep(_stepCluster.get(i));
            if(step.stepId != -1) {
                stepResult.add(step);
            }
        }

        Collections.sort(stepResult, new CompareByTimestamp());

        StepModal previousStep = new StepModal();
        int distanceTravelled = 0;
        for(int i = 0; i < stepResult.size(); i++) {
            stepResult.get(i).stepId = i*100;
            if(i > 1) {
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
            previousStep = stepResult.get(i);
        }

        return stepResult;
    }

    public static ArrayList<ArrayList<ClusterModal>> RunMasterClustering(ArrayList<ClusterModal> clusterData, ArrayList<HomesForDataClusteringModal> homes) {
        ArrayList<ArrayList<ClusterModal>> trips = new ArrayList<ArrayList<ClusterModal>>();
        ArrayList<ClusterModal> trip = new ArrayList<ClusterModal>();

        Collections.sort(clusterData, new CompareClusterByTimestamp());
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

    public static Double TimeDistance(ClusterModal p, ClusterModal q) {
        return Math.abs(p.timestamp - q.timestamp);
    }

    public static Integer EarthDistance(ClusterModal p, ClusterModal q) {
        double lat1 = p.latitude;
        double lat2 = q.latitude;
        double lon1 = q.longitude;
        double lon2 = q.longitude;

        double R = 6371;
        double dLat = ClusterProcessor.deg2rad(lat2 - lat1);
        double dLon = ClusterProcessor.deg2rad(lon2 - lon1);

        double a = Math.sin(dLat/2) * Math.sin(dLon/2) + Math.cos(ClusterProcessor.deg2rad(lat1)) * Math.cos(ClusterProcessor.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        double d = R * Float.valueOf((float)c);

        return (int)d;
    }

    public static double deg2rad(double deg) {
        return deg * (Math.PI/180);
    }

    public static StepModal convertClusterToStep(ArrayList<ClusterModal> cluster) {
        if(cluster.size() == 0) {
            StepModal step = new StepModal();
            step.stepId = -1;
            return step;
        }

        double latitudeSum = 0;
        double longitudeSum = 0;
        ArrayList<String> imageUris = new ArrayList<String>();
        ArrayList<Region> markers = new ArrayList<Region>();

        Collections.sort(cluster, new CompareClusterByTimestamp());
        for(int i = 0; i < cluster.size(); i++) {
            latitudeSum += cluster.get(i).latitude;
            longitudeSum += cluster.get(i).longitude;
            imageUris.add(cluster.get(i).image);

            Region _r = new Region();
            _r.latitude = cluster.get(i).latitude;
            _r.longitude = cluster.get(i).longitude;

            markers.add(_r);
        }

        StepModal step = new StepModal();
        step.meanLatitude = Float.valueOf((float)(latitudeSum/cluster.size()));
        step.meanLongitude = Float.valueOf((float)longitudeSum/cluster.size());
        step.markers = new RealmList<Region>();

        for(int i = 0; i < markers.size(); i++) {
            step.markers.add(markers.get(i));
        }

        step.startTimestamp = cluster.get(0).timestamp;
        step.endTimestamp = cluster.get(cluster.size() - 1).timestamp;
        step.images = new RealmList<String>();

        for(int i = 0; i < imageUris.size(); i++) {
            step.images.add(imageUris.get(i));
        }

        step.masterImage = imageUris.get(0);

        return step;
    }

}
