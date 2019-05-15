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
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        width: '45%'
    },

    text: {
        fontSize: 18,
        textAlign: 'right'
    }
});