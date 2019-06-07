import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Page } from '../Modals/ApplicationEnums';
import Icon from 'react-native-vector-icons/Octicons';


interface IProps {
    navigatorFunc: (item: string) => void
    visible: boolean
}

interface IState {

}

export class TopNavigator extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onProfilePress = () => {
        this.props.navigatorFunc(Page[Page.PROFILE])
    }

    onNewTripPress = () => {
        this.props.navigatorFunc(Page[Page.ONBOARDING])
    }

    onSettingPress = () => {
        this.props.navigatorFunc(Page[Page.SETTING])
    }

    render() {

        return (
            this.props.visible ? 
            <View style={{ width: '100%', height: 60, flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ height: 60 }} onPress={this.onSettingPress.bind(this)}>
                    <Icon style={{padding:10}} size={40} name='settings' />
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 60 }} onPress={this.onProfilePress.bind(this)}>
                    <Image style={{ width: 60, height: 60 }} source={require('../Assets/glife_logo_transparent.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 60 }} onPress={this.onNewTripPress.bind(this)}>
                    <Icon style={{padding:10}} size={40} name='sync' />
                </TouchableOpacity>
            </View>
            : <View />
        )
    }
}