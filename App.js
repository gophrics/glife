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

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0, longitude: 0,
        latitudeDelta: 0, longitudeDelta: 0
      },
      markers: []
    }

    PhotoLibraryProcessor.getPhotosFromLibrary()
    .then((res) => {
        var markers = PhotoLibraryProcessor.getMarkers(res);
        var locationInfo = PhotoLibraryProcessor.triangulatePhotoLocationInfo(res.locationList);
        console.log(res.imageList);
        this.setState({
          region: locationInfo.region,
          markers: markers,
          markerImages: res.imageList
        });
    });
  }


  onTimelineClick = () => {
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
          <TimelineElement  month="2019" onClick={this.onTimelineClick}/>
          <TimelineElement  month="January" onClick={this.onTimelineClick}/>
          <TimelineElement  month="February" onClick={this.onTimelineClick}/>
          <TimelineElement  month="March" onClick={this.onTimelineClick}/>
          <TimelineElement  month="April" onClick={this.onTimelineClick}/>
          <TimelineElement  month="May" onClick={this.onTimelineClick}/>
          <TimelineElement  month="June" onClick={this.onTimelineClick}/>
          <TimelineElement  month="July" onClick={this.onTimelineClick}/>
          <TimelineElement  month="August" onClick={this.onTimelineClick}/>
          <TimelineElement  month="September" onClick={this.onTimelineClick}/>
          <TimelineElement  month="October" onClick={this.onTimelineClick}/>
          <TimelineElement  month="November" onClick={this.onTimelineClick}/>
          <TimelineElement  month="December" onClick={this.onTimelineClick}/>
        </ScrollView>
      </View>
    );
  }
}