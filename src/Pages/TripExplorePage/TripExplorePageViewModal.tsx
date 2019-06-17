import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView, View, Image, Text, TouchableOpacity
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { StepComponent } from '../../UIComponents/StepComponent';
import { StepModal } from '../../Modals/StepModal';
import Region from '../../Modals/Region';
import { NewStepPageViewModal } from './NewStepPageViewModal';
import { Page } from '../../Modals/ApplicationEnums';
import { CustomButton } from '../../UIComponents/CustomButton';
import Icon from 'react-native-vector-icons/Octicons';
import { PhotoPopUpViewModal } from './PhotoPopUpViewModal';
import { TripExplorePageController } from './TripExplorePageController';


interface IState {
    markers: Region[],
    imageUriData: string[],
    polylineArr: any[],
    photoModalVisible: boolean,
    newStep: boolean,
    newStepId: number,
    lastStepClicked: StepModal
    editStepDescription: boolean
    tripAsSteps: StepModal[]
}

interface IProps {
    setPage: any,
    setNavigator: any
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
let snapOffsets: Array<number> = []

export default class TripExplorePageViewModal extends React.Component<IProps, IState> {

    travelCardArray: any = []
    mapView: MapView | null = null;

    Controller: TripExplorePageController;
    constructor(props: any) {
        super(props);
        this.props.setNavigator(false)

        this.Controller = new TripExplorePageController()

        this.state = {
            markers: [],
            imageUriData: [],
            polylineArr: [],
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            lastStepClicked: this.Controller.getFirstStep(),
            editStepDescription: false,
            tripAsSteps: this.Controller.getSteps()
        }
        this.initialize();
    }

    initialize() {
        this.travelCardArray = []
        //Populate travelcard Array for each step
        var markers: Region[] = []
        var imageUriData: string[] = []
        var key: number = 0;
        var tripStartTimestamp = this.state.tripAsSteps[0].startTimestamp;
        var polylineArr = []
        snapOffsets = [];

        for (var step of this.state.tripAsSteps) {
            this.travelCardArray.push(<StepComponent key={key} modal={step} daysOfTravel={Math.floor((step.endTimestamp - tripStartTimestamp) / 8.64e7)} distanceTravelled={step.distanceTravelled} onPress={(step: StepModal) => this.onMarkerPress(null, step)} />)
            this.travelCardArray.push(<CustomButton key={key + 'b'} step={step} title={"+"} onPress={(step: StepModal) => this.onNewStepPress(step)} />)

            snapOffsets.push(snapOffsets.length == 0 ? deviceWidth * 3 / 4 + 20 + 20 : snapOffsets[key - 1] + deviceWidth * 3 / 4 + 20 + 20)
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
            lastStepClicked: this.state.tripAsSteps[0]
        })
    }

    
    onNewStepPress = (step: StepModal) => {
        this.setState({
            newStep: true
        })
        this.Controller.onNewStepPress(step)
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
        if ((step.meanLatitude != this.state.lastStepClicked.meanLatitude ||
            step.meanLatitude != this.state.lastStepClicked.meanLongitude) &&
            (step.location != "Home")) {

            (this.mapView as MapView).animateToRegion({
                latitude: step.meanLatitude,
                longitude: step.meanLongitude,
                latitudeDelta: .6,
                longitudeDelta: .6
            } as Region, 1000)

            this.setState({
                photoModalVisible: true,
                lastStepClicked: step
            })
        }
    }

    onScroll = (event: any) => {
        if (this.state.tripAsSteps[Math.floor(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 20 + 20))] == undefined) return;
        this.zoomToStep(this.state.tripAsSteps[Math.floor(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 20 + 20))])
    }

    onBackPress = () => {
        this.props.setPage(Page[Page.PROFILE], null)
    }

    newStepOnDone = async(_step: StepModal|null) => {

        if(_step == null) {
            this.setState({
                newStep: false
            })
            return;
        }

        await this.Controller.newStepDone(_step)
        
        this.setState({
            newStep: false
        })

        this.Controller = new TripExplorePageController()
        this.initialize()
    }

    // Photo Modal methods
    onPhotoModalDescriptionChange = (text: string) => {
        this.state.lastStepClicked.description = text
    }

    onPhotoModalDismiss = () => {
        this.setState({
            editStepDescription: false
        })
        this.Controller.onPhotoModalDismiss(this.state.lastStepClicked)  
    }

    onPhotoModalClose = () => {
        this.setState({
            photoModalVisible: false
        })
    }

    onMapLayout = () => {
        this.zoomToStep(this.state.tripAsSteps[0])
    }

    render() {
        return (
            <View>
                <View>
                    <MapView style={{ width: '100%', height: '80%' }}
                        ref={ref => this.mapView = ref}
                        mapType='hybrid'
                        onLayout={this.onMapLayout}
                    >
                        { 
                            this.state.tripAsSteps.map((step, index) => (
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

                                                {this.state.lastStepClicked.id == step.id ? <Text style={{ color: 'white', fontStyle: 'italic' }}>{this.state.lastStepClicked.description}</Text> : <View />}
                                            </View>
                                            : <View />}
                                    </Marker>
                                    : <View />

                            ))
                        }
                        <Polyline coordinates={this.state.polylineArr} lineCap='butt' lineJoin='bevel' strokeWidth={2} geodesic={true} /> 
                        <Callout>
                            <TouchableOpacity onPress={this.onBackPress.bind(this)} style={{ padding: 10 }} >
                                <Icon size={40} style={{ padding: 10 }} name='x' />
                            </TouchableOpacity>
                        </Callout>
                        
                    </MapView>
                    {
                        <ScrollView decelerationRate={0.6} snapToOffsets={snapOffsets} scrollEventThrottle={16} onScroll={this.onScroll} horizontal={true} style={{ bottom: 0, left: 0, right: 0, height: '20%', width: '100%', overflow: 'hidden' }}>
                            {this.travelCardArray}
                        </ScrollView>
                    }
                </View>
                {
                    this.state.photoModalVisible ?
                        <PhotoPopUpViewModal
                            photoModalVisible={this.state.photoModalVisible}
                            lastStepClicked={this.state.lastStepClicked}
                            onDescriptionChange={this.onPhotoModalDescriptionChange}
                            onDismiss={this.onPhotoModalDismiss}
                            onModalClose={this.onPhotoModalClose}
                        /> :
                        <View />
                }
                {
                    this.state.newStep ?
                        <NewStepPageViewModal setPage={this.props.setPage} visible={this.state.newStep} onClose={this.newStepOnDone} />
                        : <View />
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