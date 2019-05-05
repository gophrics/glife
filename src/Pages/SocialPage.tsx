import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SliderItems } from '../Modals/ApplicationEnums';
import Region from '../Modals/Region';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {
    markers: {[key:string]: {latitude: number, longitude: number}}, //latitude, longitude as elements 
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

            var markerIn: any = []
            for(var key in this.state.markers) {
                markerIn.push({latitude: this.state.markers[key].latitude, longitude: this.state.markers[key].longitude})
            }

            this.setState({
                region: this.calculateRegion(markerIn),
                markers: markers
            });
        };

        this.ws.onclose = (e: CloseEvent) => {

        }

        this.ws.onerror = (e: Event) => {

        }

    }

    componentDidMount() {
    }   

    calculateRegion(markers: Array<any>) : Region {

        var latitudeSum: number = 0;
        var longitudeSum: number = 0;

        for(var i = 0; i < markers.length; i++) {
            latitudeSum += markers[i].latitude;
            longitudeSum += markers[i].longitude;
        }

        return new Region(latitudeSum/markers.length, longitudeSum/markers.length, 0, 0);
    }

    render() {
        var markerIn: any = []
        for(var key in this.state.markers) {
            markerIn.push({latitude: this.state.markers[key].latitude, longitude: this.state.markers[key].longitude})
        }
        return(
            <View style={StyleSheet.absoluteFillObject}>
                <MapView style={StyleSheet.absoluteFillObject} region={this.state.region}>
                    {
                        markerIn.map((value: any) => {
                            <Marker
                            key={value.longitude + Math.random()}
                            coordinate={value}
                            >
                            <View style={{
                                width: 100,
                                height: 100,
                                borderWidth: 1}}>
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