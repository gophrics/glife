import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Page } from '../Modals/ApplicationEnums';


interface IProps {
    navigatorFunc: (item: number, value: number) => {}
}

interface IState {

}

export class TopNavigator extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onProfilePress = () => {
        this.props.navigatorFunc(Page.PROFILE, 0)
    }

    onMapPress = () => {
        this.props.navigatorFunc(Page.LOADING, 0)
    }

    render() {

        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={this.onProfilePress.bind(this)}>
                    <Image style={{width: 60, height: 60}} source={require('../Assets/Poke-Ball-256.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onMapPress.bind(this, 2)}>
                    <Image style={{width: 60, height: 60}} source={require('../Assets/Premier-Ball-256.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}