import * as React from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
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
                <View style={styles.follow}>
                    <Button title={"Follow"} onPress={this.onFollowButtonPress.bind(this)}/>
                    <Button title={"Donate"} onPress={this.onDonateButtonPress.bind(this)}/>
                </View> 
                <WorldMapColouredComponent />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        alignContent: "center",
        flexDirection: "row"
    },

    follow: {
        flexDirection: "row"
    }
})