import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Loading from '../UIComponents/Loading';

interface Styles {
    spinnerContainer: ViewStyle,
    infoText: TextStyle
};

var styles = StyleSheet.create<Styles>({
    spinnerContainer: {
        flex: 1,
        marginLeft: 80,
        marginTop: 200,
    },
    infoText: {
        marginLeft: 80,
        marginTop: 300
    }
});

export default class ParsingPhotos extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
    }

    render() {

        return (
            <View>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={styles.spinnerContainer}>
                    <Loading/>
                </View>
            </View>
        );
    }

}