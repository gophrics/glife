import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { TripComponent } from '../UIComponents/TripComponent';
import { TripModal } from '../Modals/TripModal';
import Region from '../Modals/Region';

interface IState {

}
  
interface IProps {
    setPage: (page: string, data: any) => void,
    data: MapPhotoPageModal
}

export default class MapPhotoPage extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    onTimelineClick() {

    }

    onTripPress = (tripModal: TripModal) => {

    }

    render() {
        if(this.props.data == undefined) return(<View />)

        var tripRenderArray: Array<any> = []
        var i = 0;
        

        var locationData: Region[] = []
        var imageData: string[] = []
        var meanLatitudeTrip : number = 0;
        var meanLongitudeTrip: number = 0;

        for(var trip of this.props.data.trips) {
            tripRenderArray.push(<TripComponent tripModal={trip} onPress={this.onTripPress}/>)
            for(var step of trip.tripAsSteps) {
                locationData.push.apply(locationData, step.markers);
                imageData.push.apply(imageData, step.imageUris);
                meanLatitudeTrip = step.meanLatitude;
                meanLongitudeTrip = step.meanLongitude;
            }

            meanLatitudeTrip = meanLatitudeTrip/trip.tripAsSteps.length;
            meanLongitudeTrip = meanLongitudeTrip/trip.tripAsSteps.length;
        }

        var triangulatedLocation = new Region(meanLatitudeTrip, meanLongitudeTrip, 0, 0)
        const markers = locationData;
        var imageUriData = imageData; 
        
        return (
            <View>
            
            <MapView style={{width: '100%', height: '70%'}} region={triangulatedLocation} >
                {
                    markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker}
                            style={styles.imageBox}
                        >
                            <View style={styles.imageBox}>
                            <Image style={styles.imageBox} source={{uri:imageUriData[index]}}></Image>
                            </View>
                        </Marker>
                    ))
                }
            </MapView>
            
            <ScrollView horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
                { tripRenderArray }
            </ScrollView>
            </View>
        );
    
    }
}

const styles = StyleSheet.create({
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    marker: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(130,4,150, 0.3)",
      position: "absolute",
      borderWidth: 1,
      borderColor: "rgba(130,4,150, 0.5)",
    },
    imageBox: {
      width: 30,
      height: 30,
      borderWidth: 1
    }
});
