package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.ClusterModal;
import com.beerwithai.glimpse.Engine.Modals.HomesForDataClusteringModal;
import com.beerwithai.glimpse.Engine.Modals.TripModal;
import com.beerwithai.glimpse.Engine.Providers.DatabaseProvider;

public class PhotoLibraryProcessor {

    public static TripModal[] GenerateTripFromPhotos(ClusterModal[] cluster) {
        HomesForDataClusteringModal[] homes = DatabaseProvider.GetHomesForDataClustering();

    }

}
