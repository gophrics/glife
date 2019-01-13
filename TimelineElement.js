import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
    el: {
        position: 'absolute',
        width: 60,
        height: 100,
        top: 8,
        borderTopWidth: 5,
        borderColor: 'grey'
    },
    point: {
        position: 'absolute',
        top: 5,
        left: 20,
        borderRadius: 6,
        borderWidth: 6,
        borderColor: 'white'
    }
});

export default class TimelineElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            month: this.props.month
        }
    }

    render() {
        return (
            <View style={{position: 'relative' }}>
                <View style={styles.el} />
                <View style={styles.point} />
                <Text style={{left: 0, top: 25}}> {this.state.month} </Text>
            </View>
        );
    }
} 