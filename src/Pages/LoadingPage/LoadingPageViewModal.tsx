import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, Image, ProgressViewIOS, ProgressBarAndroid, Dimensions } from 'react-native';
import { Page } from '../../Modals/ApplicationEnums';
import { LoadingPageController } from './LoadingPageController';
import { NativeModules, NativeEventEmitter } from 'react-native';

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
    total: number,
    image: string
}


const deviceWidth = Dimensions.get('screen').width
export default class LoadingPageViewModal extends React.Component<IProps, IState> {

    Controller: LoadingPageController;
    done: boolean = false;
    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.state = {
            finished: 0,
            total: 100,
            image: ""
        }

        this.Controller = new LoadingPageController()
        this.Controller.Initialize()
        .then((res) => {
            if(res) {
                if(this.Controller.AtleastOneTripExist())
                    this.props.setPage(Page[Page.PROFILE])
                else
                    this.props.setPage(Page[Page.NOPHOTOSFOUND])
            }
            else
                this.props.setPage(Page[Page.NOPERMISSIONIOS])
        })
        
        const Events = new NativeEventEmitter(NativeModules.ExposedEvents)

        Events.addListener("getTotalToLoad", res => {
            this.setState({
                total: res.totalToLoad
            })
        })

        Events.addListener("getTotalLoaded", res => {
            this.setState({
                finished: res.totalLoaded
            })
        })

        Events.addListener("getImageBeingLoaded", res => {
            this.setState({
                image: res.imageBeingLoaded
            })
        })
    }

    componentWillUnmount = () => {
        this.done = true;
    }

    render() {

        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={{width: "100%", justifyContent:'center', alignSelf: 'center'}}>
                    <Image style={{width: deviceWidth*.5, height: deviceWidth*.5, alignSelf:'center'}} resizeMode='cover' source={{ uri: this.state.image }}/>
                </View>
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