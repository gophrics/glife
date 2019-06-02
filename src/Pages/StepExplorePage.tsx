import * as React from 'react';
import {
    Modal, TextInput,
    StyleSheet,
    Dimensions,
    ScrollView, View, Image, Text, TouchableHighlight, SafeAreaView, TouchableOpacity
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
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
import Icon from 'react-native-vector-icons/Octicons';
import { TravelUtils } from '../Utilities/TravelUtils';


interface IState {
    markers: Region[],
    imageUriData: string[],
    polylineArr: any[],
    photoModalVisible: boolean,
    newStep: boolean,
    newStepId: number,
    myData: TripModal,
    lastStepClicked: StepModal
    editStepDescription: boolean
    modalBottom: any
}

interface IProps {
    setPage: any,
    setNavigator: any
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
let snapOffsets: Array<number> = []

export default class StepExplorePage extends React.Component<IProps, IState> {

    travelCardArray: any = []
    mapView: MapView | null = null;

    constructor(props: any) {
        super(props);
        this.props.setNavigator(false)

        var trip = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.STEPEXPLORE]);
        this.state = {
            myData: trip,
            markers: [],
            imageUriData: [],
            polylineArr: [],
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            lastStepClicked: trip.tripAsSteps[0],
            editStepDescription: false,
            modalBottom: undefined
        }


        this.initialize();
    }

    getWidth = (width: number) => {
        // console.log(event.nativeEvent.layout.width)
        snapOffsets.push(width + 20) // 20 being width of + button in between
    }

    initialize() {
        console.log(deviceHeight)
        this.travelCardArray = []
        //Populate travelcard Array for each step
        var markers: Region[] = []
        var imageUriData: string[] = []
        var key: number = 0;
        var tripStartTimestamp = this.state.myData.tripAsSteps[0].startTimestamp;
        var polylineArr = []
        snapOffsets = [];

        for (var step of this.state.myData.tripAsSteps) {
            this.travelCardArray.push(<StepComponent key={key} modal={step} daysOfTravel={Math.floor((step.endTimestamp - tripStartTimestamp) / 8.64e7)} distanceTravelled={step.distanceTravelled} onPress={(step: StepModal) => this.onMarkerPress(null, step)} />)
            this.travelCardArray.push(<CustomButton key={key + 'b'} step={step} title={"+"} onPress={(step: StepModal) => this.onNewStepPress(step)} />)
            
            snapOffsets.push(snapOffsets.length == 0 ? deviceWidth*3/4 + 20: snapOffsets[key-1] + deviceWidth*3/4 + 20)
            markers.push.apply(markers, step.markers)
            imageUriData.push.apply(imageUriData, step.imageUris)
            polylineArr.push({ latitude: step.meanLatitude, longitude: step.meanLongitude })
            key++;
        }

        this.setState({
            markers: markers,
            imageUriData: imageUriData,
            polylineArr: polylineArr,
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            lastStepClicked: this.state.myData.tripAsSteps[0]
        })
    }

    componentDidMount() {
        this.zoomToStep(this.state.myData.tripAsSteps[0])
    }

    onNewStepPress = (step: StepModal) => {
        this.setState({
            newStep: true,
            newStepId: step.id + 1
        })
    }

    zoomToStep = (step: StepModal) => {
        if (step == undefined) return;

        (this.mapView as MapView).animateToRegion({
            latitude: step.meanLatitude,
            longitude: step.meanLongitude,
            latitudeDelta: .6,
            longitudeDelta: .6
        } as Region, 1000)

        this.setState({
            lastStepClicked: step
        })
    }

    onMarkerPress = (e: any, step: StepModal) => {
        if (step.meanLatitude != this.state.lastStepClicked.meanLatitude ||
            step.meanLatitude != this.state.lastStepClicked.meanLongitude) {
            (this.mapView as MapView).animateToRegion({
                latitude: step.meanLatitude,
                longitude: step.meanLongitude,
                latitudeDelta: .6,
                longitudeDelta: .6
            } as Region, 1000)
        }
        this.setState({
            photoModalVisible: true,
            lastStepClicked: step
        })
    }

    newStepOnDone = (data: any) => {

        if (data['images'].length == 0) {
            this.setState({
                newStep: false
            })
            return
        }

        TravelUtils.getCoordinatesFromLocation(data['location'])
            .then((res: any) => {
                // Assuming first location
                res = res[0]

                var step = new StepModal()
                var imageDataList: Array<ImageDataModal> = []
                for (var image of data['images']) {
                    imageDataList.push(new ImageDataModal(new Region(res.lat, res.lon, 0, 0), image.path, (new Date(Number.parseInt(image.creationDate) * 1000)).getTime()))
                }

                step.masterImageUri = imageDataList[0].image;

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

                BlobSaveAndLoad.Instance.setBlobValue(Page[Page.STEPEXPLORE], trip)
                this.setState({
                    myData: trip
                })
                this.initialize()
            })

    }


    onScroll = (event: any) => {
        if (event.nativeEvent.contentOffset.x < 0 || (Math.ceil(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 24))) > this.state.myData.tripAsSteps.length) return;
        this.zoomToStep(this.state.myData.tripAsSteps[Math.ceil(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 24))])
    }

    onBackPress = () => {
        this.props.setPage(Page[Page.PROFILE], null)
    }

    render() {
        if (this.state.myData == undefined ||
            this.state.lastStepClicked == undefined) return (<View />)
        return (
            <View>
                <View>
                    <MapView style={{ width: '100%', height: '77%' }}
                        ref={ref => this.mapView = ref}
                        //Check with 'hybrid, the performance
                        mapType='hybrid'
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

                            {this.state.lastStepClicked.id == step.id ?  <Text style={{ color: 'white' }}>{this.state.lastStepClicked.description}</Text> : <View /> }
                                            </View>
                                            : <View />}
                                    </Marker>
                                    : <View />
                                
                            ))
                        }
                        <Polyline coordinates={this.state.polylineArr} lineCap='butt' lineJoin='bevel' strokeWidth={2} geodesic={true} />
                        <Callout>
                            <TouchableOpacity onPress={this.onBackPress.bind(this)} style={{ padding: 10 }} >
                                <Icon size={40} style={{padding:10}} name='x' />
                            </TouchableOpacity>
                        </Callout>

                        <Callout style={{ top: Dimensions.get('window').height - 330 }}>
                        </Callout>
                    </MapView>
                    {
                        <ScrollView decelerationRate={0.6} snapToOffsets={snapOffsets} scrollEventThrottle={16} onScroll={this.onScroll} horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: 150, width: '100%', overflow: 'hidden' }}>
                            {this.travelCardArray}
                        </ScrollView>
                    }
                </View>
                {this.state.photoModalVisible ?
                    <Modal
                        animationType='fade'
                        visible={this.state.photoModalVisible}
                        transparent={true}
                        onDismiss={() => {
                            var trip = this.state.myData
                            for(var _step of trip.tripAsSteps) {
                                if(_step.id == this.state.lastStepClicked.id) {
                                    _step = this.state.lastStepClicked
                                }
                                BlobSaveAndLoad.Instance.setBlobValue(Page[Page.STEPEXPLORE], this.state.myData)
                                this.setState({
                                    myData: trip,
                                    editStepDescription: false,
                                    modalBottom: undefined
                                })
                            }
                        }}>

                        <SafeAreaView style={{ margin: 30, bottom: this.state.modalBottom, flex: 1, alignContent: 'center', justifyContent: 'center' }}>
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
                                        scrollEventThrottle={10} //how often we update the position of the indicator bar
                                        pagingEnabled={true} //scrolls from one image to the next, instead of allowing any value inbetween
                                        style={{ aspectRatio: 1 }}
                                        snapToAlignment='center'
                                        snapToInterval={deviceWidth - 60}
                                        decelerationRate={0}
                                        stickyHeaderIndices={[0]}
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
                                    <View style={{ height: '10%', backgroundColor: '#ffffffff', padding: 2 }}>
                                        <TextInput multiline={true} editable={true} onChangeText={(text) => {
                                            this.state.lastStepClicked.description = text;
                                        }} 
                                        style={{
                                            backgroundColor: '#ffffffff',
                                            padding: 5,
                                            color: 'black'
                                        }}
                                        onFocus= {
                                            () => {
                                                this.setState({
                                                    modalBottom: 200
                                                })
                                            }
                                        }

                                        onBlur = {
                                            () => {
                                                this.setState({
                                                    modalBottom: undefined
                                                })
                                            }
                                        }
                                        >{this.state.lastStepClicked.description}</TextInput>
                                    </View>
                                </View>
                            </View>

                        </SafeAreaView>
                    </Modal>
                    : <View />}
                {this.state.newStep ?
                    <NewStepPage visible={this.state.newStep} onClose={(data: StepModal) => this.newStepOnDone(data)} />
                    : <View />}
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
