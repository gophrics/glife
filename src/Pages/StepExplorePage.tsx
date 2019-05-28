import * as React from 'react';
import { Modal, Button,
    StyleSheet, 
    Dimensions,
    ScrollView, View, Image, Text, TouchableHighlight, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StepComponent } from '../UIComponents/StepComponent';
import { TripModal } from '../Modals/TripModal';
import { StepModal } from '../Modals/StepModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';
import Region from '../Modals/Region';
import { NewStepPage } from './NewStepPage';

interface IState {
    markers: Region[],
    triangulatedLocation: Region,
    imageUriData: string[],
    polylineArr: any[],
    photoModalVisible: boolean,
    newStep: boolean
}

interface IProps {
    data: TripModal
}

const deviceWidth = Dimensions.get('window').width

export default class StepExplorePage extends React.Component<IProps, IState> {

    travelCardArray: any = []
    mapView: any = "";
    lastStepClicked: StepModal = new StepModal()

    constructor(props: any) {
        super(props);
        //Populate travelcard Array for each step
        var latitudeSum = 0;
        var longitudeSum = 0;
        var trip = this.props.data;
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
            this.travelCardArray.push(<StepComponent key={key} modal={step} daysOfTravel={Math.floor((step.endTimestamp - tripStartTimestamp) / 8.64e7)} distanceTravelled={distanceTravelled} onPress={(step: StepModal) => this.onStepClick(step)} />)
            this.travelCardArray.push(<Button key={key+'b'} title={"+"} onPress={() => this.onNewStepPress(key)} />)
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
            newStep: false
        }

        setTimeout(() => {
            this.onStepClick(this.props.data.tripAsSteps[0])
        }, 1000)
    }

    onNewStepPress = (id: number) => {
        this.setState({
            newStep: true
        })
    }

    onStepClick = (step: StepModal) => {
        this.lastStepClicked = step
        this.setState({})
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
                    longitude: step.meanLongitude
                } as Region
            })
        }, 1200)
        this.refs.scrollRef.scrollTo({x: deviceWidth*step.id*3/4 - deviceWidth*3/16 + deviceWidth*3/32, y: 0, Animated: true})
    }

    onMarkerPress = (e: any, index: number) => {
        if( this.props.data.tripAsSteps[index].meanLatitude != this.lastStepClicked.meanLatitude || 
            this.props.data.tripAsSteps[index].meanLatitude != this.lastStepClicked.meanLongitude ) {
                this.lastStepClicked = this.props.data.tripAsSteps[index]
                this.mapView.animateToRegion({
                    latitude: this.props.data.tripAsSteps[index].meanLatitude,
                    longitude: this.props.data.tripAsSteps[index].meanLongitude,
                    latitudeDelta: .3,
                    longitudeDelta: .3
                } as Region, 1000)
                this.refs.scrollRef.scrollTo({x: deviceWidth*this.lastStepClicked.id*3/4 - deviceWidth*3/16 + deviceWidth*3/32, y: 0, Animated: true})
        }
        this.setState({
            triangulatedLocation: new Region(this.lastStepClicked.meanLatitude, this.lastStepClicked.meanLongitude, 0, 0),
            photoModalVisible: true
        })
    }

    render() {
        if (this.props.data == undefined) return (<View />)
        return (
            <View>
                <View>
                    <MapView style={{ width: '100%', height: '70%' }}
                        ref={ref => this.mapView = ref}
                        region={this.state.triangulatedLocation}
                    >
                        {
                            this.props.data.tripAsSteps.map((step, index) => (
                                <Marker
                                    key={index}
                                    coordinate={step.masterMarker}
                                    style={this.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox}
                                    onPress={(e) => this.onMarkerPress(e, index)} 
                                >
                                    <View style={this.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox} >
                                            <Image 
                                                style={this.lastStepClicked.id == step.id ? styles.largeImageBox : styles.imageBox} source={{ uri: step.masterImageUri == "" ? "ABC" : step.masterImageUri }}></Image>
                                    </View>
                                </Marker>
                            ))
                        }
                        <Polyline coordinates={this.state.polylineArr} lineCap='butt' lineJoin='bevel' strokeWidth={2} geodesic={true} />
                    </MapView>
                    {
                        <ScrollView ref={'scrollRef'} horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width: '100%', borderWidth: 1, backgroundColor: '#454545', overflow: 'hidden' }}>
                            {this.travelCardArray}
                        </ScrollView>
                    }
                </View>
                <Modal
                    animationType='fade'
                    visible={this.state.photoModalVisible}
                    transparent={true}>

                    <SafeAreaView style={{ margin: 30, flex: 1, alignContent:'center', justifyContent: 'center' }}>
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
                                        style={{padding: 10}}>
                                        <Text>X</Text>
                                </TouchableHighlight>
                                <ScrollView horizontal={true} //scrolling left to right instead of top to bottom
                                    showsHorizontalScrollIndicator={false} //hides native scrollbar
                                    scrollEventThrottle={10} //how often we update the position of the indicator bar
                                    pagingEnabled={true} //scrolls from one image to the next, instead of allowing any value inbetween
                                    style={{aspectRatio: 1}}
                                    snapToAlignment='center'
                                    snapToInterval={deviceWidth-60}
                                    decelerationRate={0}
                                >
                                {
                                    this.lastStepClicked.imageUris.map((imageUri, index) => (
                                        <View style={{width: deviceWidth-60, height: deviceWidth-60, alignContent:'center', backgroundColor: 'white'}} key={index}>
                                            <Image
                                                resizeMode='contain'  
                                                style={{width: deviceWidth-60, height: deviceWidth-60}} source={{uri: imageUri == "" ? "ABC" : imageUri}} 
                                            />
                                        </View>
                                    ))
                                }

                                </ScrollView>
                            </View>

                            <View style={{height: '30%', backgroundColor:'#808080ff'}}>
                                <Text>Comments go here </Text>    
                            </View>
                        </View>

                    </SafeAreaView>
                </Modal>
                <NewStepPage visible={this.state.newStep} onDone={() => {this.setState({newStep: false})}}/>
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
