import React from 'react';
import MapView from 'react-native-maps';
import { CameraRoll, StyleSheet, ScrollView, View, Text } from 'react-native';
import TimelineElement from './TimelineElement';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0, longitude: 0,
        latitudeDelta: 0, longitudeDelta: 0
      }
    }

    this.getPhotosFromLibrary();
  }

  getPhotosFromLibrary = () => {
    CameraRoll.getPhotos({ first: 1000000000 })
    .then((res) => {
      var locationInfo = {
        region: {
          latitude: 0, longitude: 0,
          latitudeDelta: 0, longitudeDelta: 0
        }
      }
      for(var image of res.edges) {
        if(image && image.node && image.node.location) {
          locationInfo.region.latitude  = image.node.location.latitude;
          locationInfo.region.longitude = image.node.location.longitude;
        }
        break;
      }
      this.setState({
        region: locationInfo.region
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
        
        <MapView style={StyleSheet.absoluteFillObject} region={this.state.region}/>
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