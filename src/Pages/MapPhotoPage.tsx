import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { TripComponent } from '../UIComponents/TripComponent';
import { StepComponent } from '../UIComponents/StepComponent';
import { TripModal } from '../Modals/TripModal';
import { StepModal } from '../Modals/StepModal';
import Region from '../Modals/Region';

interface IState {
    markers: Region[],
    triangulatedLocation: Region
    imageUriData: string[]
}
  
interface IProps {
    setPage: (page: string, data: any) => void,
    data: MapPhotoPageModal,
    isSingleTrip: boolean
}

export default class MapPhotoPage extends React.Component<IProps, IState> {

    tripRenderArray: any = []
    travelCardArray: any = []

    constructor(props: any) {
        super(props);
        if(this.props.isSingleTrip) {
            var i = 0;
            

            var locationData: Region[] = []
            var imageData: string[] = []
            var meanLatitudeTrip : number = 0;
            var meanLongitudeTrip: number = 0;

            for(var trip of this.props.data.trips) {
                this.tripRenderArray.push(<TripComponent tripModal={trip} onPress={this.onTripPress}/>)
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
            this.state = {
                triangulatedLocation: triangulatedLocation,
                markers: markers,
                imageUriData: imageUriData
            }
        } else {
            //Populate travelcard Array for each step
            var latitudeSum = 0;
            var longitudeSum = 0;
            var trip = this.props.data.trips[0];
            var markers: Region[] = []
            var imageUriData: string[] = []
            for(var step of trip.tripAsSteps) {
                latitudeSum += step.meanLatitude
                longitudeSum += step.meanLongitude
                this.travelCardArray.push(<StepComponent modal={step} daysOfTravel={0} distanceTravelled={0} onPress={(step: StepModal) => this.onStepClick(step)} />)
                markers.push.apply(markers, step.markers)
                imageUriData.push.apply(imageUriData, step.imageUris)
            }

            var triangulatedLocation = new Region(latitudeSum/trip.tripAsSteps.length, longitudeSum/trip.tripAsSteps.length, 0, 0)
            this.state = {
                triangulatedLocation: triangulatedLocation,
                markers: markers,
                imageUriData: imageUriData
            }
        } 

    }

    onStepClick = (step: StepModal) => {
        this.setState({
            triangulatedLocation: {
                latitude: step.meanLatitude,
                longitude: step.meanLongitude,
                latitudeDelta: 0,
                longitudeDelta: 0
            } as Region,
            imageUriData: step.imageUris,
            markers: step.markers
        });
    }

    onTripPress = (tripModal: TripModal) => {

    }

    render() {
        if(this.props.data == undefined) return(<View />)
        
        return (
            <View>
            
            <MapView style={{width: '100%', height: '70%'}} region={this.state.triangulatedLocation} >
                {
                    this.state.markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker}
                            style={styles.imageBox}
                        >
                            <View style={styles.imageBox}>
                            <Image style={styles.imageBox} source={{uri:this.state.imageUriData[index]}}></Image>
                            </View>
                        </Marker>
                    ))
                }
            </MapView>
            
            <ScrollView horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
                { this.props.isSingleTrip? this.tripRenderArray : this.travelCardArray }
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
