import * as React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import { Page } from '../Modals/ApplicationEnums';

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

interface IProps {
    setPage: (page: Page) => void
}

interface IState {

}

export default class ParsingPhotoPage extends React.Component<IProps, IState> {

    constructor(props:any) {
        super(props);
    }

    render() {

        return (
            <View>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={styles.spinnerContainer}>
                    <Spinner/>
                </View>
            </View>
        );
    }

}