import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, AsyncStorage } from 'react-native';
import TimelineElement from '../UIComponents/TimelineElement';
import Region from '../Modals/Region';
import ImageDataModal from '../Modals/ImageDataModal';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {Page} from '../Modals/ApplicationEnums';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';


interface IState {

}
  
interface IProps {
    setPage: (page: string, data: any) => void,
    data: any
}

export default class MapPhotoPage extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    onTimelineClick() {

    }

    render() {
        if(this.props.data == undefined) return(<View />)

        var timelineRenderArray: Array<any> = []
        var i = 0;

        for(var entry in this.props.data['sortedTimelineData']) {
            var monthArray: any[] = this.props.data['sortedTimelineData'][entry];
            var year = +entry;
            for(var month of monthArray){
                i++;
                timelineRenderArray.push(<TimelineElement key={i} month={month} year={year} onClick={this.onTimelineClick.bind(this, month, year)} />);
            }
        }

        const markers = PhotoLibraryProcessor.getMarkers(this.props.data.imageData);
        var imageUriData = PhotoLibraryProcessor.getImageUriArray(this.props.data.imageData);

        return (
            <View style={StyleSheet.absoluteFillObject}>
            
            <MapView style={StyleSheet.absoluteFillObject} region={this.props.data.region} >
            {
                markers.map((marker, index) => (
                    <Marker
                    key={marker.longitude}
                    coordinate={marker}
                    >
                    <View style={styles.imageBox}>
                    <Image style={styles.imageBox} source={{uri:imageUriData[index]}}></Image>
                    </View>
                    </Marker>
                ))
            }
            </MapView>
            
            <ScrollView horizontal={true} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, width:'100%', borderWidth: 1, backgroundColor: 'skyblue' }}>
                { timelineRenderArray }
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
