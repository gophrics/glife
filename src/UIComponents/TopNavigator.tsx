import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Page } from '../Modals/ApplicationEnums';


interface IProps {
    navigatorFunc: (item: string, value: number) => {}
}

interface IState {

}

export class TopNavigator extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onProfilePress = () => {
        this.props.navigatorFunc(Page[Page.PROFILE], 0)
    }

    onNewTripPress = () => {
        this.props.navigatorFunc(Page[Page.NEWTRIP], 0)
    }

    onMapPress = () => {
        this.props.navigatorFunc(Page[Page.LOADING], 0)
    }

    render() {

        return (
            <View style={{ width: '100%'}}>
                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.onProfilePress.bind(this)}>
                        <Image style={{width: 60, height: 60, alignSelf: 'center'}} source={require('../Assets/logo.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={this.onNewTripPress.bind(this)}>
                        <Image style={{width: 60, height: 60, alignSelf: 'flex-end'}} source={require('../Assets/logo.png')}/>
                    </TouchableOpacity>
            </View>
        )
    }
}