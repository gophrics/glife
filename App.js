import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

export default class App extends React.Component {

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        
        <MapView style={StyleSheet.absoluteFillObject} />

        <ScrollView style={{ position: 'absolute', bottom: 50, left: 0, right: 0, height: 50, borderWidth: 1 }}>
          <Text>12312</Text>
        </ScrollView>
      </View>
    );
  }
}