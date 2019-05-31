import * as React from 'react';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    el: {
        position: 'absolute',
        alignSelf: 'flex-start',
        width: '100%',
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
        borderColor: 'black'
    }
});

interface IProps {
    month: string,
    year: number,
    onClick: any
}
export default class TimelineElement extends React.Component<IProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            month: this.props.month
        }
    }

    render() {
        return (
            <TouchableHighlight style={{position: 'relative', width: 100 }} onPress={this.props.onClick}>
                <View>
                    <View style={styles.el} />
                    <View style={styles.point} />
                    <Text style={{left: 0, color: 'black', top: 25}}> {this.props.year + "\n" + this.props.month}  </Text>
                </View>
            </TouchableHighlight>
        );
    }
} 