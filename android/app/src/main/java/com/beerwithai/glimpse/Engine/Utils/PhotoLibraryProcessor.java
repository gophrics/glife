package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.StepModal;
import com.beerwithai.glimpse.Engine.Modals.TripModal;
import com.beerwithai.glimpse.Engine.Providers.DatabaseProvider;

import java.util.ArrayList;

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
        trip.daysOfTravel = Integer.valueOf((int)(steps.get(steps.size() -1).endTimestamp - steps.get(0).startTimestamp)/86400));

    }

}
