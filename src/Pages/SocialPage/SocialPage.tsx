import * as React from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Callout, Marker, AnimatedRegion } from 'react-native-maps';
import { SliderItems } from '../../Modals/ApplicationEnums';
import Region from '../../Modals/Region';
import SnapSlider from '../../UIComponents/SnapSlider';
import ChatComponent from '../../UIComponents/ChatComponent';

interface IState {
    markers: {[key:string]: {latitude: number, longitude: number}}, //latitude, longitude as elements
    markersAsArray: Array<Region>
    region: Region,
    socketState: string,
    page: string
}

interface IProps {
    sliderChangeCallback: (item: number, value: number) => void
}


export default class SocialPage extends React.Component<IProps, IState> {

    Timer: number = 0;
    nearmeWs: WebSocket;
    //chatWs: WebSocket;

    constructor(props: IProps) {
        super(props);

        this.state = {
            markers: {} as {[key:string]: {latitude: number, longitude: number}},
            region: new Region(0, 0, 0, 0),
            markersAsArray: [],
            socketState: "CLOSED",
            // Change to 'NearYou'
            page: 'Helpline'
        }

        
        this.nearmeWs = new WebSocket('ws://localhost:8080/api/v1/location/nearme');
        this.nearmeWs.onopen = () => {
            // connection opened
            this.nearmeWs.send(JSON.stringify({profileId: "1", latitude: 1.123, longitude: 2.232})); // send a message
            this.setState({
                socketState: "OPENED"
            })
        };

        this.nearmeWs.onmessage = (e: MessageEvent) => {
        // a message was received
            var data = JSON.parse(e.data)
            var markers: {[key:string]: {latitude: number, longitude: number}} = this.state.markers;
            markers[data.profileId]= {
                latitude: data.latitude,
                longitude: data.longitude
            };

            var markerIn: Array<Region> = new Array<Region>();
            var latitudeArray: Array<number> = [];
            var longitudeArray: Array<number> = [];

            for(var key in markers) {
                markerIn.push(new Region(this.state.markers[key].latitude, this.state.markers[key].longitude, 0, 0))
                latitudeArray.push(this.state.markers[key].latitude)
                longitudeArray.push(this.state.markers[key].longitude)
            }

            this.setState({
                region: new Region(latitudeArray.reduce((a, b) => { return a + b; }, 0) / latitudeArray.length,
                        longitudeArray.reduce((a, b) => { return a + b; }, 0) / longitudeArray.length, 0, 0),
                markers: markers,
                markersAsArray: markerIn
            });
        };

        this.nearmeWs.onclose = (e: CloseEvent) => {

        }

        this.nearmeWs.onerror = (e: Event) => {

        }
/*
        this.chatWs = new WebSocket('ws://localhost:8080/api/v1/chat');
        this.chatWs.onopen = () => {
            this.nearmeWs.send(JSON.stringify({profileId: "1"}))
        }

        this.chatWs.onmessage = (e: MessageEvent) => {
        }
*/
    }

    nearYouPress = () => {
        this.setState({
            page: 'NearYou'
        })
    }

    helplinePress = () => {
        this.setState({
            page: 'Helpline'
        })
    }

    swipePress = () => {
        this.setState({
            page: 'Swipe'
        })
    }

    render() {

        if(this.state.page == 'NearYou') {
            return(
                <View style={StyleSheet.absoluteFillObject}>
                    <MapView style={StyleSheet.absoluteFillObject} region={this.state.region}>
                        {
                            // WHAT's the frickin difference in using 
                            // ((value: Region, index: number) => (...code...)      Working
                            // ((value: Region, index: number) => {...code...}      Not frickin working
                            // EDIT: Apparently, if {} is used, you need to return the whole JSX
                            this.state.markersAsArray.map((value: Region, index: number) => (
                                <Marker key={index} coordinate={value}>
                                    <View style={{ width: 30, height: 30, borderWidth: 1}} >
                                    </View>
                                </Marker>
                            ))
                        }
                        <Callout style={{ top: 50, left: 120, width: 140, height: 50, borderWidth: 1}}> 
                            <SnapSlider 
                                style={{ top: 50, left: 120}}
                                items={SliderItems} 
                                defaultItem={1}
                                sliderChangeCallback={this.props.sliderChangeCallback}
                            />
                        </Callout>
                    </MapView>

                    <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'skyblue', alignItems:'stretch', justifyContent:'center', position:'absolute', bottom: 0, left: 0, right: 0, width:"100%", height:"10%"}}>
                        <TouchableOpacity style={{
                            backgroundColor: "black",
                            padding: 20
                        }} onPress={this.nearYouPress.bind(this)}>
                            <Text>NearYou</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: "black",
                            padding: 20
                        }} onPress={this.helplinePress.bind(this)}>
                            <Text>Helpline</Text>
                        </TouchableOpacity><TouchableOpacity style={{
                            backgroundColor: "black",
                            padding: 20
                        }} onPress={this.swipePress.bind(this)}>
                            <Text>Swipe</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if(this.state.page == "Helpline") {
            return (
            <View>
                <SnapSlider 
                                style={{ top: 50, left: 120, width:140, borderWidth: 1}}
                                items={SliderItems} 
                                defaultItem={1}
                                sliderChangeCallback={this.props.sliderChangeCallback}
                            />

                <View style={{marginTop: 60}}>
                    <ChatComponent myMessage={true} messageSenderName={"Nitin"} message={"Hi there"} messageTimestamp="02/11/1993 05:31" />
                </View>
            </View>
            )
        }
    }

}