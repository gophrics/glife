import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { NativeModules, NativeEventEmitter, StyleSheet, ScrollView, View, Image } from 'react-native';
import TimelineElement from './UIComponents/TimelineElement';
import * as PhotoLibraryProcessor from './Utilities/PhotoLibraryProcessor';
import Region from './Modals/Region';
import ImageDataModal from './Modals/ImageDataModal';

const LocationService = new NativeEventEmitter(NativeModules.LocationService)

LocationService.addListener('LocationListener',
(res) => { console.log(res) });

const styles = StyleSheet.create({
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  imageBox: {
    width: 30,
    height: 30,
    borderWidth: 1
  }
});

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];
    
interface IState {
  region: Region,
  imageData: Array<ImageDataModal>,
  sortedTimelineData: Map<number, Array<string>>
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      region: new Region(0, 0, 0, 0),
      imageData: [],
      sortedTimelineData: new Map<number, Array<string>>()
    } as IState;
    
    PhotoLibraryProcessor.getPhotosFromLibrary()
    .then((photoRollInfos: Array<ImageDataModal>) => {

        var markers = PhotoLibraryProcessor.getMarkers(photoRollInfos);
        var triangulatedLocation: Region = PhotoLibraryProcessor.triangulatePhotoLocationInfo(markers);
        this.setState({
          region: triangulatedLocation,
          imageData: photoRollInfos
        });
    })
    .then(() => {
      this.populateTimelineData();
    })
  }

  populateTimelineData = () => {
       
    var timelineData: Array<number> = PhotoLibraryProcessor.getTimelineData(this.state.imageData);
    var imageUriArray: Array<any> = PhotoLibraryProcessor.getImageUriArray(this.state.imageData); //TO BE USED

    timelineData.sort((a, b) => {
      return a < b ? -1 : 1;
    });

    console.log(timelineData);
    var initialDate = new Date(timelineData[0]);
    var finalDate = new Date(timelineData[timelineData.length-1]);

    console.log(initialDate);
    console.log(finalDate);
    var j = initialDate.getMonth();
    var timeline: Map<number, Array<string>> = new Map<number, Array<string>>();
    for(var i = initialDate.getFullYear(); i <= finalDate.getFullYear(); i++) {
      var monthsInTheYear: Array<string> = [];
      while(j <= months.length) {
        monthsInTheYear.push(months[j-1]);
        j++;
      }
      timeline.set(i, monthsInTheYear);
      j = 1;
    }

    this.setState({
      sortedTimelineData: timeline
    });
  }


  onTimelineClick = (monthAsString: string, year: number) => {

  }


  render() {
    var timelineRenderArray = []
    var i = 0;

    for(let yearMonth of this.state.sortedTimelineData.entries()) {
      var year = yearMonth[0];
      var monthArray = yearMonth[1];
      i++;
      for(var month of monthArray)
        timelineRenderArray.push(<TimelineElement key={i} month={month} year={year} onClick={this.onTimelineClick.bind(this, month, year)} />);
    }

    const markers = PhotoLibraryProcessor.getMarkers(this.state.imageData);
    var imageUriData = PhotoLibraryProcessor.getImageUriArray(this.state.imageData);

    return (
      <View style={StyleSheet.absoluteFillObject}>
        
        <MapView style={StyleSheet.absoluteFillObject} region={this.state.region} >
        {
            markers.map((marker, index) => (
              <Marker
                key={marker.longitude}
                coordinate={marker}
              >
              <View style={styles.imageBox}>
                <Image style={styles.imageBox} source={{uri:imageUriData[index]}}></Image>
              </View>
              </Marker>
            ))
        }
        </MapView>
        
        <ScrollView horizontal={true} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
          { timelineRenderArray }
        </ScrollView>
      </View>
    );
  }
}