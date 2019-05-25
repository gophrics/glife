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
            <View style={{ width: '100%'}}>
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.onProfilePress.bind(this)}>
                    <Image style={{width: 60, height: 60, alignSelf: 'center'}} source={require('../Assets/logo.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}