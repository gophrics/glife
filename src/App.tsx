import * as React from 'react';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import { StyleSheet, ScrollView, View, Image, AsyncStorage } from 'react-native';
import TimelineElement from './UIComponents/TimelineElement';
import * as PhotoLibraryProcessor from './Utilities/PhotoLibraryProcessor';
import Region from './Modals/Region';
import ImageDataModal from './Modals/ImageDataModal';
import RNBackgroundService from 'react-native-background-service';
import ParsingPhotos from './Pages/ParsingPhotos';


RNBackgroundService.RNBackgroundServiceLocationListener.addListener('LocationListener',
(res) => { console.log("Location: " + res) });

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
  
enum Page {
  LOADING,
  MAPVIEW,
  HOME
}

interface IState {
  region: Region,
  imageData: Array<ImageDataModal>,
  sortedTimelineData: {[key: number]: Array<string>},
  page: Page
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    RNBackgroundService.RNBackgroundServiceLocationService.requestPermission();
    RNBackgroundService.RNBackgroundServiceLocationService.startLocationTracking();

    this.state = {
      region: new Region(0, 0, 0, 0),
      imageData: [],
      sortedTimelineData: {} as {[key: number]: Array<string>},
      page: Page.MAPVIEW
    } as IState;

    AsyncStorage.getItem('lastState').then((item) => {
      if(item) {
        this.state = JSON.parse(item);
      } else {
        this.initialize();
      }
      this.initialize();
    });

  }

  initialize = () => {
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

    this.setState({
      sortedTimelineData: timeline,
      page: Page.MAPVIEW
    });

    AsyncStorage.setItem('lastState', JSON.stringify(this.state));
  }


  onTimelineClick = (monthAsString: string, year: number) => {

  }


  render() {

    if(this.state.page == Page.MAPVIEW) {
        var timelineRenderArray: Array<any> = []
        var i = 0;

        for(var entry in this.state.sortedTimelineData) {
          var monthArray: any[] = this.state.sortedTimelineData[entry];
          var year = +entry;
          for(var month of monthArray){
            i++;
            timelineRenderArray.push(<TimelineElement key={i} month={month} year={year} onClick={this.onTimelineClick.bind(this, month, year)} />);
          }
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
    } else if(this.state.page == Page.LOADING) {
      return (
        <ParsingPhotos />
      )
    }
  }
}