import * as React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WorldMapColouredComponent } from './WorldMapColouredComponent';

interface IState {

}

interface IProps {

}

export class ProfileComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onFollowButtonPress = () => {

    }

    onDonateButtonPress = () => {

    }

    render() {
        return (
            <View style={styles.main}>
                <Image source={{}}/> 
                <View style={styles.followButtonGroup}>
                    <TouchableOpacity style={styles.button} onPress={this.onFollowButtonPress.bind(this)}>
                        <Text style={styles.text}>Follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.onFollowButtonPress.bind(this)}>
                        <Text style={styles.text}>Donate</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        marginTop: 50
    },

    followButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: 'grey',
        padding: 5,
        margin: 20,
    },
    text: {
        color: 'white'
    }
})