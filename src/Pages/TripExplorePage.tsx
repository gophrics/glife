import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native';
//import MapView, { Marker } from 'react-native-maps';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { TripComponent } from '../UIComponents/TripComponent';
import { Page } from '../Modals/ApplicationEnums';
import { TripModal } from '../Modals/TripModal';
import Region from '../Modals/Region';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';

interface IState {
    markers: Region[],
    triangulatedLocation: Region
    imageUriData: string[]
}
  
interface IProps {
    setPage: (page: string, data: any) => void
}

export default class TripExplorePage extends React.Component<IProps, IState> {

    tripRenderArray: any = []
    myData: MapPhotoPageModal;

    constructor(props: any) {
        super(props);
        this.myData = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.TRIPEXPLORE]]
        // var locationData: Region[] = []
        // var imageData: string[] = []
        // var meanLatitudeTrip : number = 0;
        // var meanLongitudeTrip: number = 0;

        for(var trip of this.myData.trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress}/>)
            // for(var step of trip.tripAsSteps) {
            //     locationData.push.apply(locationData, step.markers);
            //     imageData.push.apply(imageData, step.imageUris);
            //     meanLatitudeTrip = step.meanLatitude;
            //     meanLongitudeTrip = step.meanLongitude;
            // }

            // meanLatitudeTrip = meanLatitudeTrip/trip.tripAsSteps.length;
            // meanLongitudeTrip = meanLongitudeTrip/trip.tripAsSteps.length;
        }

        // var triangulatedLocation = new Region(meanLatitudeTrip, meanLongitudeTrip, 0, 0)
        // const markers = locationData;
        // var imageUriData = imageData; 
        // this.state = {
        //     triangulatedLocation: triangulatedLocation,
        //     markers: markers,
        //     imageUriData: imageUriData
        // }
    }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.STEPEXPLORE], tripModal)
    }

    render() {
        if(this.myData == undefined) return(<View />)
        
        return (
            <View style={{backgroundColor: '#454545'}}>
                {/*
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
                */}
                
                <ScrollView horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: '#808080', overflow:'hidden' }}>
                    { this.tripRenderArray  }
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
