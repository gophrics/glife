import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
    el: {
        width: 100,
        height: 100,
        top: 8,
        borderTopWidth: 2,
        borderColor: 'grey'
    },
    point: {
        width: 100,
        height: 100,
        top: 2,
        borderTopWidth: 2,
        borderColor: 'blue'
    }
});

export default class TimelineElement extends React.Component {

    render() {
        return (
            <View>
                <View style={styles.el} />
                <View style={styles.point} />
            </View>
        );
    }
} 