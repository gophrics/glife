import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IProps {
    myMessage: boolean
    messageSenderName: string
    messageTimestamp: string
    message: string
}

interface IState {

}


export default class ChatComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        console.log(this.props.message);
    }

    render() {

        var messageStyle = this.props.myMessage ? styles.messageMe : styles.messageOthers;
        return (
            <View style={messageStyle}>
                <Text style={{
                    fontSize: 20
                }}>{"  " + this.props.messageSenderName}</Text>
                <Text style={{
                }}>{"  " + this.props.messageTimestamp}</Text>
                <Text style={{
                    alignSelf: 'flex-end',
                    fontSize: 16
                }}>{this.props.message}</Text>
            </View>
        ) 
    }
}

const styles = StyleSheet.create({
    messageOthers: {
        flexDirection: 'column',
        marginRight: 40,
        paddingRight: 20,
        backgroundColor: 'skyblue',
        borderRadius: 10
    },
    messageMe: {
        flexDirection: 'column',
        marginLeft: 40,
        paddingRight: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 10
    }
})