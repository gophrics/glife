import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, AsyncStorage, ImageProgressEventDataIOS } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import {Page, months} from '../Modals/ApplicationEnums';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
import Region from '../Modals/Region';
import ImageDataModal from '../Modals/ImageDataModal';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';
import { StepModal } from '../Modals/StepModal';

interface Styles {
    spinnerContainer: ViewStyle,
    infoText: TextStyle
};

var styles = StyleSheet.create<Styles>({
    spinnerContainer: {
        flex: 1,
        marginLeft: 80,
        marginTop: 200,
    },
    infoText: {
        marginLeft: 80,
        marginTop: 300
    }
});

interface IProps {
    onDone: (data: any) => void,
    homes: {[key:number]: ClusterModal}
}

interface IState {

}

export default class LoadingPage extends React.Component<IProps, IState> {

    dataToSendToNextPage: MapPhotoPageModal = new MapPhotoPageModal([]);

    constructor(props:any) {
        super(props);
        this.initialize();
    }

    render() {
        return (
            <View>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={styles.spinnerContainer}>
                    <Spinner/>
                </View>
            </View>
        );
    }

    // Helper methods
    initialize () {
        PhotoLibraryProcessor.getPhotosFromLibrary()
        .then((photoRollInfos: Array<ImageDataModal>) => {
    
            var markers = PhotoLibraryProcessor.getMarkers(photoRollInfos);
            var timelineData: Array<number> = PhotoLibraryProcessor.getTimelineData(photoRollInfos);

            var clusterData: Array<ClusterModal> = [];
            for(var i = 0; i < markers.length; i++) {
                clusterData.push({
                    latitude: markers[i].latitude, 
                    longitude: markers[i].longitude, 
                    timestamp: timelineData[i]} as ClusterModal )
            }

            // Expanding homes to timestamp
            var homesDataForClustering: {[key:number]: ClusterModal} = {}
            var initialTimestamp = 0;
            var endTimestamp = 0;
            for(var data in this.props.homes) {
                endTimestamp = this.props.homes[data].timestamp/86400
                if(endTimestamp == undefined || endTimestamp == null) //Current day
                    endTimestamp = (new Date()).getTime()/86400
                for(var i = initialTimestamp; i < endTimestamp; i++) {
                    homesDataForClustering[i] = this.props.homes[data]
                }
                initialTimestamp = endTimestamp;
            }

            var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);
            console.log(trips)

            for(var trip of trips) {
                var steps: StepModal[] = ClusterProcessor.RunStepClustering(trip);
                this.dataToSendToNextPage.trips.push(steps);
            }


            // var triangulatedLocation: Region = PhotoLibraryProcessor.triangulatePhotoLocationInfo(markers);
            // this.dataToSendToNextPage.region = triangulatedLocation;
            // this.dataToSendToNextPage.imageData = photoRollInfos;
        })
        .then(() => {
          //this.populateTimelineData();
        })
        .then(() => {
          //this.filterOutTrips();  
        });
    }

    populateTimelineData () {
        
        var timelineData: Array<number> = PhotoLibraryProcessor.getTimelineData(this.dataToSendToNextPage.imageData);
        var imageUriArray: Array<any> = PhotoLibraryProcessor.getImageUriArray(this.dataToSendToNextPage.imageData); //TO BE USED

        timelineData.sort((a, b) => {
        return a < b ? -1 : 1;
        });

        var initialDate = new Date(timelineData[0]);
        var finalDate = new Date(timelineData[timelineData.length-1]);
        var j = initialDate.getMonth();
        var timeline: {[key: number]: Array<string>} = {} as {[key: number]: Array<string>};

        for(var i = initialDate.getFullYear(); i <= finalDate.getFullYear(); i++) {
            var monthsInTheYear: Array<string> = [];
            while(j <= months.length) {
                monthsInTheYear.push(months[j-1]);
                j++;
            }
            timeline[i] = monthsInTheYear;
            j = 1;
        }
        this.dataToSendToNextPage.sortedTimelineData = timeline;
        this.props.onDone(this.dataToSendToNextPage);
    }


    filterOutTrips = () => {
        var trips: MapPhotoPageModal[]
        
    }
}