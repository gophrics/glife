import * as React from 'react';
import { View } from 'react-native';

interface IState {

}

interface IProps {

}


export default class SocialPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return(
            <View />
        )
    }

    openWebSocket () {
        var ws = new WebSocket('http://localhost:3000/websocket');
    }
}