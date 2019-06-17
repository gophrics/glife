import * as React from 'react'
import { View, Image, Dimensions } from 'react-native';

interface IProps {
    setNavigator: any
}

interface IState {

}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export class SplashScreen extends React.Component<IProps, IState> {

    constructor(props: IProps){ 
        super(props)
        this.props.setNavigator(false)
    }

    render() {
        return (
            <View style={{height: '100%', width: '100%', justifyContent: 'center', alignContent: 'center'}}>
                <Image style={{alignSelf:'center', height:deviceWidth*.5, width: deviceWidth*.5}} source={require('../Assets/Glimpse_logo_transparent.png')} />
            </View>
        )
    }
}