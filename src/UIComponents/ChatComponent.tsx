import * as React from 'react';
import { View } from 'react-native';

interface IProps {
    myMessage: boolean
    messageSenderName: string
    messageTimestamp: string
}

interface IState {

}


export default class ChatComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <View />
        )
    }
}