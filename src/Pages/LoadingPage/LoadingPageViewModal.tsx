import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, Image, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import { PublisherSubscriber } from '../../Engine/PublisherSubscriber'
import { Page } from '../../Modals/ApplicationEnums';
import { LoadingPageController } from './LoadingPageController';
import { TripUtils } from '../../Engine/Utils/TripUtils';
import * as Engine from '../../Engine/Engine';

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
            if(res)
                this.props.setPage(Page[Page.PROFILE])
            else
                this.props.setPage(Page[Page.NOPERMISSIONIOS])
        })
        this.getLoadingDetails()

        this.updateImage()
    }

    updateImage = () => {
        if(this.done) return
        console.log(PublisherSubscriber.ImageBus)
        this.setState({
            image: PublisherSubscriber.ImageBus
        })
        setTimeout(() => {
            this.updateImage()
        }, 1000);
    }

    getLoadingDetails = () => {
        if(this.done) return
        this.setState({
            total: TripUtils.TOTAL_TO_LOAD,
            finished: TripUtils.FINISHED_LOADING
        })
        setTimeout(this.getLoadingDetails, 1000)
    }

    componentWillUnmount = () => {
        this.done = true;
    }

    render() {

        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <View style={{width: "60%", justifyContent:'center', alignSelf: 'center'}}>
                    <Image style={{width: 100, height: 100}} resizeMode='cover' source={{ uri: this.state.image }}/>
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