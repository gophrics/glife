import * as React from 'react'
import { View, Image, Dimensions } from 'react-native';

interface IProps {
    setNavigator: any
}

interface IState {

}

const deviceWidth = Dimensions.get('window').width

export class SplashScreen extends React.Component<IProps, IState> {

    constructor(props: IProps){ 
        super(props)
        this.props.setNavigator(false)
    }

    render() {
        return (
            <View style={{flex:1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <Image style={{height:deviceWidth*.5, width: deviceWidth*.5, marginRight: deviceWidth*.15}} source={require('../Assets/glife_logo.png')} />
            </View>
        )
    }
}