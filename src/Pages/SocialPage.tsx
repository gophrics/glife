import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SliderItems } from '../Modals/ApplicationEnums';
import Region from '../Modals/Region';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {
    markers: Array<any>,
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
            markers: [],
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
            console.log(e.data);
        };

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


        var i = 0;
        while(i < 5) {
            if(this.state.socketState == "OPENED")
                this.ws.send(JSON.stringify({profileId: "1", latitude: 1.123, longitude: 2.232}));
            i++;
        }

        return(
            <View style={StyleSheet.absoluteFillObject}>
                <MapView style={StyleSheet.absoluteFillObject} region={this.state.region}>
                    {
                        console.log(this.state.markers)
                    }
                    {
                        this.state.markers.map((marker, index) => (
                            <Marker
                            key={marker.longitude}
                            coordinate={marker}
                            >
                            <View style={{
                                width: 30,
                                height: 30,
                                borderWidth: 1}}>
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
            </View>
        )
    }

}