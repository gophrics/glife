import * as React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { Page } from '../Modals/ApplicationEnums';

interface IProps {
    visible: boolean
    navigatorFunc: any
}

interface IState {

}

const deviceWidth = Dimensions.get('window').width

export class BottomNavigator extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onProfilePress = () => {
        this.props.navigatorFunc(Page[Page.PROFILE])
    }

    onAddTripPress = () => {
        this.props.navigatorFunc(Page[Page.NEWTRIP])
    }

    onSearchPress = () => {
        this.props.navigatorFunc(Page[Page.SEARCH])
    }

    onFeedPress = () => {
        this.props.navigatorFunc(Page[Page.FEED])
    }

    render() {
        return (
            <View style={{flexDirection: 'row', padding: 5, justifyContent:'space-between', width: deviceWidth}}>

                <TouchableOpacity onPress={this.onProfilePress}>
                    <Icon name='profile' size={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onAddTripPress}>
                    <Icon name='plus' size={30} />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={this.onSearchPress}>
                    <Icon name='search1' size={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onFeedPress}> 
                    <Icon name='appstore-o' size={30} />   
                </TouchableOpacity>
                
            </View>
        )
    }
}