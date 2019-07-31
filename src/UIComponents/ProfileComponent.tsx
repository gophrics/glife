import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface IState {
}

interface IProps {
    profilePic: string
    onProfilePicChange: any
}

export class ProfileComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onFollowButtonPress = () => {

    }

    onDonateButtonPress = () => {

    }

    onProfilePicChange = () => {
        // ImagePicker.openPicker({
        // }).then((image: any) => {
        //     this.props.onProfilePicChange(image.path)
        // });
    }


    render() {
        return (
            <View style={styles.main}>
                <TouchableOpacity onPress={this.onProfilePicChange}>
                    <Image style={{width: 200, height: 200, borderRadius: 100, borderWidth: 2}} source={{uri: this.props.profilePic}}/> 
                </TouchableOpacity>
                {
                /*
                <View style={styles.followButtonGroup}>
                    <TouchableOpacity style={styles.button} onPress={this.onFollowButtonPress.bind(this)}>
                        <Text style={styles.text}>Follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.onFollowButtonPress.bind(this)}>
                        <Text style={styles.text}>Donate</Text>
                    </TouchableOpacity>
                </View> 
                */
                }
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