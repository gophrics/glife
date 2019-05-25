import * as React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

interface IState {

}

interface IProps {
    background?: Image,
    text: string
}

export class StatsAsCardComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <View style={styles.card}>
                <View style={{height: 40}}/>
                <Text style={styles.text}>{this.props.text}</Text>
                <View style={{height: 40}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        width: '45%',
        height: '100%',
        alignSelf: 'center'
    },

    text: {
        fontSize: 18,
        textAlign: 'right',
        padding: 10,
        color:'white'
    }
});