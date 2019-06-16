import * as React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
            <LinearGradient colors={['#ffe766', '#ccac00']} style={styles.card}>
            <View >
                <View style={{height: 40}}/>
                <Text style={styles.text}>{this.props.text}</Text>
                <View style={{height: 40}}/>
            </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        width: '49.5%',
        height: '100%',
        alignContent: 'space-between',
        backgroundColor: 'lightblue',
    },

    text: {
        fontSize: 18,
        textAlign: 'center',
        padding: 10,
        color:'black'
    }
});