import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Animated, StyleSheet, ScrollView, View, Image } from 'react-native';
import TimelineElement from './TimelineElement';
import * as PhotoLibraryProcessor from './Utilities/PhotoLibraryProcessor';



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
    
export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0, longitude: 0,
        latitudeDelta: 0, longitudeDelta: 0
      },
      markers: [],
      timelineData: [],
      timelines: []
    }
    
    PhotoLibraryProcessor.getPhotosFromLibrary()
    .then((res) => {
        var markers = PhotoLibraryProcessor.getMarkers(res);
        var locationInfo = PhotoLibraryProcessor.triangulatePhotoLocationInfo(res.locationInfo);
        this.setState({
          region: locationInfo.region,
          markers: markers,
          markerImages: res.imageData,
          timelineData: res.timestampList
        });
    })
    .then(() => {
      this.populateTimelineData();
    })
  }

  populateTimelineData = () => {
       
    var timelineData = this.state.timelineData;
    timelineData.sort((a, b) => {
      return a < b ? -1 : 1;
    });

    // Converting to millisecond timestamp by * 1000
    var initialDate = new Date(timelineData[0]*1000);
    var finalDate = new Date(timelineData[timelineData.length-1]*1000);

    var j = initialDate.getMonth();
    var timeline = {};
    for(var i = initialDate.getFullYear(); i <= finalDate.getFullYear(); i++) {
      timeline[i] = []
      j = 1;
      while(j <= months.length) {
        timeline[i].push(months[j-1]);
        j++;
      }
    }

    this.setState({
      timelines: timeline
    });
  }


  onTimelineClick = (month, year) => {
    var region = {
      latitude: 10,
      longitude: 10,
      latitudeDelta: 2,
      longitudeDelta: 2
    }
    this.setState({
      region: region
    });

    console.log("onTimelineClick and region change");
  }


  render() {

    var timelineRenderArray = []
    var i = 0;
    for(var year in this.state.timelines) {
      for(var month in this.state.timelines[year]) {
        i++;
        timelineRenderArray.push(<TimelineElement key={i} month={months[month]} year={year} onClick={(month, year) => this.onTimelineClick(month, year)} />);
      }
    }

    return (
      <View style={StyleSheet.absoluteFillObject}>
        
        <MapView style={StyleSheet.absoluteFillObject} region={this.state.region} annotations={this.state.markers}>
          {
            this.state.markers.map((marker, index) => (
            <Marker
              key={marker.latlong.longitude}
              coordinate={marker.latlong}
              title={marker.title}
              description={marker.description}
            >
            <View style={styles.imageBox}>
              <Image style={styles.imageBox} source={{uri:this.state.markerImages[index]}}></Image>
            </View>
            </Marker>
          ))}
        </MapView>
        
        <ScrollView horizontal={true} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
          {
            timelineRenderArray
          }
        </ScrollView>
      </View>
    );
  }
}