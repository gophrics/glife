import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { StepComponent } from '../UIComponents/StepComponent';
import { TripModal } from '../Modals/TripModal';
import { StepModal } from '../Modals/StepModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor }  from '../Utilities/ClusterProcessor';
import Region from '../Modals/Region';

interface IState {
    markers: Region[],
    triangulatedLocation: Region
    imageUriData: string[]
}
  
interface IProps {
    data: TripModal
}

export default class StepExplorePage extends React.Component<IProps, IState> {

    travelCardArray: any = []

    constructor(props: any) {
        super(props);
        //Populate travelcard Array for each step
        var latitudeSum = 0;
        var longitudeSum = 0;
        var trip = this.props.data;
        var markers: Region[] = []
        var imageUriData: string[] = []
        var key = 0;
        var tripStartTimestamp = trip.tripAsSteps[0].startTimestamp;
        var distanceTravelled = 0
        for(var step of trip.tripAsSteps) {
            if(key > 0)
            distanceTravelled += Math.floor(ClusterProcessor.EarthDistance({latitude: trip.tripAsSteps[key].meanLatitude, longitude: trip.tripAsSteps[key].meanLongitude} as ClusterModal,
                                {latitude: trip.tripAsSteps[key-1].meanLatitude, longitude: trip.tripAsSteps[key-1].meanLongitude} as ClusterModal))
            
            latitudeSum += step.meanLatitude
            longitudeSum += step.meanLongitude
            this.travelCardArray.push(<StepComponent key={key} modal={step} daysOfTravel={Math.floor((step.endTimestamp-tripStartTimestamp)/86400)} distanceTravelled={distanceTravelled} onPress={(step: StepModal) => this.onStepClick(step)} />)
            markers.push.apply(markers, step.markers)
            imageUriData.push.apply(imageUriData, step.imageUris)
            key++;
        }

        var triangulatedLocation = new Region(latitudeSum/trip.tripAsSteps.length, longitudeSum/trip.tripAsSteps.length, 0, 0)
        this.state = {
            triangulatedLocation: triangulatedLocation,
            markers: markers,
            imageUriData: imageUriData
        }
    }

    onStepClick = (step: StepModal) => {
        console.log("Step clicked")
        console.log(step)
        this.setState({
            triangulatedLocation: {
                latitude: step.meanLatitude,
                longitude: step.meanLongitude,
                latitudeDelta: 5,
                longitudeDelta: 5
            } as Region,
            imageUriData: step.imageUris,
            markers: step.markers
        });
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
            {
            <ScrollView horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
                { this.travelCardArray }
            </ScrollView>
            }
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
