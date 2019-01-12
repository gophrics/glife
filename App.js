import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import TimelineElement from './TimelineElement';

export default class App extends React.Component {

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        
        <MapView style={StyleSheet.absoluteFillObject} />
        <ScrollView horizontal={true} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1 }}>
            
          <TimelineElement />
        </ScrollView>
      </View>
    );
  }
}