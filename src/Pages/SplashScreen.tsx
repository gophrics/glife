import * as React from 'react'
import { View, Text } from 'react-native';

interface IProps {
    setNavigator: any
}

interface IState {

}

export class SplashScreen extends React.Component<IProps, IState> {

    constructor(props: IProps){ 
        super(props)
        this.props.setNavigator(false)
    }

    render() {
        return (
            <View>
                <Text>Splash screen goes here</Text>
            </View>
        )
    }
}