import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Callout, Marker, AnimatedRegion } from 'react-native-maps';
import { SliderItems } from '../Modals/ApplicationEnums';
import Region from '../Modals/Region';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {
    markers: {[key:string]: {latitude: number, longitude: number}}, //latitude, longitude as elements
    markersAsArray: Array<Region>
    region: Region,
    socketState: string
}

interface IProps {
    sliderChangeCallback: (item: number, value: number) => void
}


export default class SocialPage extends React.Component<IProps, IState> {

    Timer: number = 0;
    ws: WebSocket;
    constructor(props: IProps) {
        super(props);

        this.state = {
            markers: {} as {[key:string]: {latitude: number, longitude: number}},
            region: new Region(0, 0, 0, 0),
            markersAsArray: [],
            socketState: "CLOSED"
        }

        
        this.ws = new WebSocket('ws://localhost:8080/api/v1/location/nearme');
        this.ws.onopen = () => {
            // connection opened
            this.ws.send(JSON.stringify({profileId: "1", latitude: 1.123, longitude: 2.232})); // send a message
            this.setState({
                socketState: "OPENED"
            })
        };

        this.ws.onmessage = (e: MessageEvent) => {
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

        this.ws.onclose = (e: CloseEvent) => {

        }

        this.ws.onerror = (e: Event) => {

        }

    }

    render() {
        this.state.markersAsArray.map((value: Region, index: number) => {
            console.log(value);
            console.log(index);
        })
        return(
            <View style={StyleSheet.absoluteFillObject}>
                <MapView style={StyleSheet.absoluteFillObject} region={this.state.region}>
                    {
                        this.state.markersAsArray.map((value: Region, index: number) => {
                            <Marker key={index} coordinate={value}>
                                <View style={{ width: 30, height: 30, borderWidth: 3}} >
                                </View>
                            </Marker>
                        })
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
            </View>
        )
    }

}