import * as React from 'react';
import {
    Modal, Button,
    StyleSheet,
    Dimensions,
    ScrollView, View, Image, Text, TouchableHighlight, SafeAreaView
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StepComponent } from '../UIComponents/StepComponent';
import { TripModal } from '../Modals/TripModal';
import { StepModal } from '../Modals/StepModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';
import Region from '../Modals/Region';
import { NewStepPage } from './NewStepPage';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import ImageDataModal from '../Modals/ImageDataModal';
import { CustomButton } from '../UIComponents/CustomButton';

interface IState {
    markers: Region[],
    triangulatedLocation: Region,
    imageUriData: string[],
    polylineArr: any[],
    photoModalVisible: boolean,
    newStep: boolean,
    newStepId: number,
    myData: TripModal,
    lastStepClicked: StepModal
}

interface IProps {
}

const deviceWidth = Dimensions.get('window').width

export default class StepExplorePage extends React.Component<IProps, IState> {

    travelCardArray: any = []
    mapView: any = "";
    constructor(props: any) {
        super(props);
        this.initialize();
    }

    initialize() {
        this.travelCardArray = []
        //Populate travelcard Array for each step
        var latitudeSum = 0;
        var longitudeSum = 0;
        var trip = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.STEPEXPLORE]);
        var markers: Region[] = []
        var imageUriData: string[] = []
        var key: number = 0;
        var tripStartTimestamp = trip.tripAsSteps[0].startTimestamp;
        var distanceTravelled = 0
        var polylineArr = []
        for (var step of trip.tripAsSteps) {
            if (key > 0)
                distanceTravelled += Math.floor(ClusterProcessor.EarthDistance({ latitude: trip.tripAsSteps[key].meanLatitude, longitude: trip.tripAsSteps[key].meanLongitude } as ClusterModal,
                    { latitude: trip.tripAsSteps[key - 1].meanLatitude, longitude: trip.tripAsSteps[key - 1].meanLongitude } as ClusterModal))

            latitudeSum += step.meanLatitude
            longitudeSum += step.meanLongitude
            this.travelCardArray.push(<StepComponent key={key} modal={step} daysOfTravel={Math.floor((step.endTimestamp - tripStartTimestamp) / 8.64e7)} distanceTravelled={distanceTravelled} onPress={(step: StepModal) => this.onMarkerPress(null, step)} />)
            this.travelCardArray.push(<CustomButton key={key + 'b'} step={step} title={"+"} onPress={(step: StepModal) => this.onNewStepPress(step)} />)
            markers.push.apply(markers, step.markers)
            imageUriData.push.apply(imageUriData, step.imageUris)
            polylineArr.push({ latitude: step.meanLatitude, longitude: step.meanLongitude })
            key++;
        }

        var triangulatedLocation = new Region(latitudeSum / trip.tripAsSteps.length, longitudeSum / trip.tripAsSteps.length, 0, 0)
        this.state = {
            triangulatedLocation: triangulatedLocation,
            markers: markers,
            imageUriData: imageUriData,
            polylineArr: polylineArr,
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            myData: trip,
            lastStepClicked: trip.tripAsSteps[0]
        }
        setTimeout(() => {
            this.zoomToStep(this.state.myData.tripAsSteps[0])
        }, 1000)
    }

    onNewStepPress = (step: StepModal) => {
        console.log("onNewStepPress called")
        this.setState({
            newStep: true,
            newStepId: step.id + 1
        })
    }

    zoomToStep = (step: StepModal) => {
        if(step == undefined) return;
        
        this.mapView.animateToRegion({
            latitude: step.meanLatitude,
            longitude: step.meanLongitude,
            latitudeDelta: .3,
            longitudeDelta: .3
        } as Region, 1000)

        setTimeout(() => {
            this.setState({
                triangulatedLocation: {
                    latitude: step.meanLatitude,
                    longitude: step.meanLongitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                } as Region,
                lastStepClicked: step
            })
        }, 4000)
    }

    onMarkerPress = (e: any, step: StepModal) => {
        if (step.meanLatitude != this.state.lastStepClicked.meanLatitude ||
            step.meanLatitude != this.state.lastStepClicked.meanLongitude) {
            this.mapView.animateToRegion({
                latitude: step.meanLatitude,
                longitude: step.meanLongitude,
                latitudeDelta: .3,
                longitudeDelta: .3
            } as Region, 1000)
        }
        this.setState({
            triangulatedLocation: new Region(this.state.lastStepClicked.meanLatitude, this.state.lastStepClicked.meanLongitude, 0, 0),
            photoModalVisible: true,
            lastStepClicked: step
        })
    }

    newStepOnDone = (data: any) => {

        if(data['images'].length == 0) {
            this.setState({
                newStep: false})
                return}

        var step = new StepModal()
        step.imageUris = data['images']
        var imageDataList: Array<ImageDataModal> = []
        for (var image of data['images']) {
            console.log(image)
            if (image.latitude && image.longitude) {
                imageDataList.push(new ImageDataModal(new Region(image.latitude, image.longitude, 0, 0), image.uri, (new Date(image.timestamp)).getTime()))
            }
        }

        var clusterData: Array<ClusterModal> = [];
        for (var i = 0; i < imageDataList.length; i++) {
            clusterData.push({
                image: imageDataList[i].image,
                latitude: imageDataList[i].location.latitude,
                longitude: imageDataList[i].location.longitude,
                timestamp: imageDataList[i].timestamp,
                id: i
            } as ClusterModal)
        }

        var _step = ClusterProcessor.convertClusterToStep(clusterData);
        _step.id = this.state.newStepId;

        //Right now, we're calcualting step based on images, and not overriding them

        var trip = this.state.myData
        trip.tripAsSteps.push(_step);
        trip.tripAsSteps.sort((a: StepModal, b: StepModal) => {
            return a.id - b.id;
        })

        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.STEPEXPLORE], this.state.myData)
        this.setState({
            newStep: false,
            myData: trip
        })
        this.initialize()
    }


    onScroll = (event: any) => {
        if(event.nativeEvent.contentOffset.x < 0 || (Math.floor(event.nativeEvent.contentOffset.x/(deviceWidth*.75))) > this.state.myData.tripAsSteps.length) return; 
        this.zoomToStep(this.state.myData.tripAsSteps[Math.floor(event.nativeEvent.contentOffset.x/(deviceWidth*.75))])
    }

    render() {
        if (this.state.myData == undefined || 
            this.state.lastStepClicked == undefined ) return (<View />)
        return (
            <View>
                <View>
                    <MapView style={{ width: '100%', height: '70%' }}
                        ref={ref => this.mapView = ref}
                        region={this.state.triangulatedLocation}
                    >
                        {
                            this.state.myData.tripAsSteps.map((step, index) => (
                                step.masterMarker != undefined ? 
                                        <Marker
                                            key={index}
                                            coordinate={step.masterMarker}
                                            style={this.state.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox}
                                            onPress={(e) => this.onMarkerPress(e, step)}
                                        >
                                            {step.masterImageUri != "" ?
                                                <View style={this.state.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox} >
                                                    <Image
                                                        style={this.state.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox} source={{ uri: step.masterImageUri }}></Image>
                                                </View>
                                                : <View />}
                                        </Marker>
                                : <View />
                            ))
                        }
                        <Polyline coordinates={this.state.polylineArr} lineCap='butt' lineJoin='bevel' strokeWidth={2} geodesic={true} />
                    </MapView>
                    {
                        <ScrollView decelerationRate={0.6}  snapToInterval={(deviceWidth*3/4 + 25)} scrollEventThrottle={10000} onScroll={this.onScroll} horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width: '100%', borderWidth: 1, backgroundColor: 'lightgreen', overflow: 'hidden' }}>
                            {this.travelCardArray}
                        </ScrollView>
                    }
                </View>
                <Modal
                    animationType='fade'
                    visible={this.state.photoModalVisible}
                    transparent={true}>

                    <SafeAreaView style={{ margin: 30, flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                        <View style={{
                            backgroundColor: '#808080ff',
                            borderRadius: 10
                        }}>
                            <View>


                                <TouchableHighlight
                                    onPress={() => {
                                        this.setState({
                                            photoModalVisible: false
                                        })
                                    }}
                                    style={{ padding: 10 }}>
                                    <Text>X</Text>
                                </TouchableHighlight>
                                <ScrollView horizontal={true} //scrolling left to right instead of top to bottom
                                    showsHorizontalScrollIndicator={false} //hides native scrollbar
                                    scrollEventThrottle={10} //how often we update the position of the indicator bar
                                    pagingEnabled={true} //scrolls from one image to the next, instead of allowing any value inbetween
                                    style={{ aspectRatio: 1 }}
                                    snapToAlignment='center'
                                    snapToInterval={deviceWidth - 60}
                                    decelerationRate={0}
                                >
                                    {
                                        this.state.lastStepClicked.imageUris.map((imageUri, index) => (
                                            imageUri != "" ?
                                                <View style={{ width: deviceWidth - 60, height: deviceWidth - 60, alignContent: 'center', backgroundColor: 'black' }} key={index}>
                                                    <Image
                                                        resizeMode='contain'
                                                        style={{ width: deviceWidth - 60, height: deviceWidth - 60 }} source={{ uri: imageUri }}
                                                    />
                                                </View>
                                                : <View />
                                        ))
                                    }

                                </ScrollView>
                            </View>

                            <View style={{ height: '30%', backgroundColor: '#808080ff' }}>
                                <Text>Comments go here </Text>
                            </View>
                        </View>

                    </SafeAreaView>
                </Modal>
                <NewStepPage visible={this.state.newStep} onClose={(data: StepModal) => this.newStepOnDone(data)} />
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
        borderRadius: 5,
        zIndex: 0
    },
    largeImageBox: {
        width: 200,
        height: 200,
        zIndex: 1,
        borderRadius: 5
    }
});
