import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { SliderItems } from '../Modals/ApplicationEnums';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {

}

interface IProps {
    sliderChangeCallback: (item: number, value: number) => void
}


export default class SocialPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

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
            console.log(response);
        })
    }

    render() {
        return(
            <View style={StyleSheet.absoluteFillObject}>
                <MapView style={StyleSheet.absoluteFillObject}>
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