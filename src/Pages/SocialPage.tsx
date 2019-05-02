import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SliderItems } from '../Modals/ApplicationEnums';
import Region from '../Modals/Region';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {
    markers: Array<any>,
    region: Region
}

interface IProps {
    sliderChangeCallback: (item: number, value: number) => void
}


export default class SocialPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            markers: [],
            region: new Region(0, 0, 0, 0)
        }
        fetch('http://localhost:8080/location/v1/nearme', {
            method: 'POST',    
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'profileId': '1',
                'latitude': 9.2324,
                'longitude': 9.2324
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.profileArray == undefined) return;
            this.setState({
                markers: response.profileArray,
                region: this.calculateRegion(response.profileArray)
            });
        })
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