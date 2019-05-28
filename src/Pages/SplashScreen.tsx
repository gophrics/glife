import * as React from 'react'
import { View, Text } from 'react-native';

interface IProps {

}

interface IState {

}

export class SplashScreen extends React.Component<IProps, IState> {

    constructor(props: IProps){ 
        super(props)
    }

    render() {
        return (
            <View>
                <Text>Splash screen goes here</Text>
            </View>
        )
    }
}