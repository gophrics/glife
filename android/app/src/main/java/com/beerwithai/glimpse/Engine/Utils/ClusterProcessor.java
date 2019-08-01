package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.StepModal;

import java.util.ArrayList;
import java.util.List;

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
    }
}
