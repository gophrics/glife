import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, PermissionsAndroid, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import Spinner from '../../UIComponents/Spinner';
import { Page } from '../../Modals/ApplicationEnums';
import { LoadingPageController } from './LoadingPageController';
import { TripUtils } from '../../Engine/TripUtils';

interface Styles {
    spinnerContainer: ViewStyle,
    infoText: TextStyle
};

var styles = StyleSheet.create<Styles>({
    spinnerContainer: {
        flex: 5,
        alignSelf: 'center'
    },
    infoText: {
        flex: 9,
        fontFamily: 'AppleSDGothicNeo-Regular',
        fontSize: 28,
        textAlign: 'center',
        padding: '20%',
        alignSelf: 'center',
        color:'white'
    }
});

interface IProps {
    setNavigator: any,
    setPage: any
}

interface IState {
    finished: number,
    total: number
}



export default class LoadingPageViewModal extends React.Component<IProps, IState> {

    Controller: LoadingPageController;

    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.state = {
            finished: 0,
            total: 100
        }

        this.Controller = new LoadingPageController()
        this.Controller.Initialize()
        .then((res) => {
            if(res)
                this.props.setPage(Page[Page.PROFILE])
            else
                this.props.setPage(Page[Page.NOPERMISSIONIOS])
        })
        this.getLoadingDetails()
    }

    getLoadingDetails = () => {
        this.setState({
            total: TripUtils.TOTAL_TO_LOAD,
            finished: TripUtils.FINISHED_LOADING
        })
        setTimeout(this.getLoadingDetails, 1000)
    }

    render() {

        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <Text style={{fontSize: 16, textAlign:'center', padding: 20, color:"white"}}>Make sure you don't close the app, and phone doesn't get locked</Text>
                <View style={{width: "60%", alignSelf: 'center'}}>
                {
                    Platform.OS == 'ios' ? 
                        <View>
                            <ProgressViewIOS progressViewStyle={'bar'} progress={this.state.finished/this.state.total}/>
                        </View>
                        : 
                        <ProgressBarAndroid indeterminate={false} progress={this.state.finished/this.state.total}/>
                }
                </View>
            </View>
        );
    }

}