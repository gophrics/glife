import * as React from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native';
import TimelineElement from '../UIComponents/TimelineElement';
import MapView from 'react-native-maps';
import {Marker, Callout} from 'react-native-maps';
import {Page, SliderItems} from '../Modals/ApplicationEnums';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
import SnapSlider from '../UIComponents/SnapSlider';

interface IState {

}
  
interface IProps {
    setPage: (page: string, data: any) => void,
    data: any,
    sliderChangeCallback: (item: number, value: number) => void
}

export default class MapPhotoPage extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    navigateToSocial() {
        this.props.setPage(Page[Page.SOCIAL], null);
    }

    navigateToTravel() {

    }

    navigateToStats() {

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
                <Callout style={{ top: 50, left: 120, width: 140, height: 50, borderWidth: 1}}> 
                    <SnapSlider 
                        style={{ top: 50, left: 120}}
                        items={SliderItems} 
                        defaultItem={0}
                        sliderChangeCallback={this.props.sliderChangeCallback}
                    />
                </Callout>
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
