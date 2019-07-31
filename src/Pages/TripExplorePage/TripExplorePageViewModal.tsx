import * as React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView, View, Image, Text, TouchableOpacity
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StepComponent } from '../../UIComponents/StepComponent';
import { StepModal } from '../../Engine/Modals/StepModal';
import { Region } from 'react-native-maps';
import { NewStepPageViewModal } from './NewStepPageViewModal';
import { Page } from '../../Modals/ApplicationEnums';
import { CustomButton } from '../../UIComponents/CustomButton';
import Icon from 'react-native-vector-icons/Octicons';
import { PhotoPopUpViewModal } from './PhotoPopUpViewModal';
import { TripExplorePageController } from './TripExplorePageController';


interface IState {
    imageUriData: string[],
    polylineArr: any[],
    photoModalVisible: boolean,
    newStep: boolean,
    newStepId: number,
    lastStepClicked: StepModal
    steps: StepModal[]
    masterPic: string
    stepMarkerImages: Array<string>
}

interface IProps {
    setPage: any,
    setNavigator: any
}

const deviceWidth = Dimensions.get('window').width
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
            imageUriData: [],
            polylineArr: [],
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            lastStepClicked: new StepModal(),
            steps: [],
            masterPic: "",
            stepMarkerImages: []
        }
        this.loadState()
    }

    async loadState() {

        var steps = await this.Controller.getSteps()
        steps.sort((a: StepModal, b: StepModal) => {
            return a.stepId - b.stepId
        })
        
        this.travelCardArray = []
        //Populate travelcard Array for each step
        var imageUriData: string[] = []
        var key: number = 0;
        var tripStartTimestamp = steps[0].startTimestamp;
        var polylineArr = []
        snapOffsets = [];

        for (var step of steps) {
            this.travelCardArray.push(<StepComponent key={key + 's'} modal={step} daysOfTravel={Math.floor((step.endTimestamp - tripStartTimestamp) / 8.64e7)} distanceTravelled={step.distanceTravelled} onPress={(step: StepModal) => this.onMarkerPress(null, step.stepId)} />)
            this.travelCardArray.push(<CustomButton key={key + 'b'} step={step} title={"+"} onPress={(step: StepModal) => this.onNewStepPress(step)} />)

            snapOffsets.push(snapOffsets.length == 0 ? deviceWidth * 3 / 4 + 20 + 20 : snapOffsets[key - 1] + deviceWidth * 3 / 4 + 20 + 20)
            imageUriData.push.apply(imageUriData, step.images)
            polylineArr.push({ latitude: step.meanLatitude, longitude: step.meanLongitude })
            key++;
        }

        this.setState({
            imageUriData: imageUriData,
            polylineArr: polylineArr,
            photoModalVisible: false,
            newStep: false,
            newStepId: -1,
            lastStepClicked: steps[0],
            steps: steps
        }, () => {
            this.zoomToStep(this.state.steps[0])
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

    onMarkerPress = (e: any, stepId: number) => {
        var step: StepModal = this.state.steps[0];
        
        for(var _step of this.state.steps) {
            if(_step.stepId == stepId) {
                step = _step;
                break;
            }
        }

        console.log(step)
        if ((step.meanLatitude != this.state.lastStepClicked.meanLatitude ||
            step.meanLatitude != this.state.lastStepClicked.meanLongitude) &&
            (step.stepName != "Home")) {

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

    onScroll = (event: any) => {
        if (this.state.steps[Math.floor(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 20 + 20))] == undefined) return;
        this.zoomToStep(this.state.steps[Math.floor(event.nativeEvent.contentOffset.x / (deviceWidth * 3 / 4 + 20 + 20))])
    }

    onBackPress = () => {
        this.props.setPage(Page[Page.PROFILE], null)
    }

    newStepOnDone = async (_step: StepModal | null) => {

        if (_step == null) {
            this.setState({
                newStep: false
            })
            return;
        }

        await this.Controller.newStepDone(_step)

        this.setState({
            newStep: false
        })

        this.setState({
            steps: await this.Controller.getSteps()
        })
        this.loadState()
    }

    // Photo Modal methods
    onPhotoModalDescriptionChange = (text: string) => {
        this.Controller.SetDescription(text, this.state.lastStepClicked.stepId)
    }

    onPhotoModalClose = () => {
        this.setState({
            photoModalVisible: false
        })
    }

    render() {
        return (
            <View>
                <View>
                    <MapView style={{ width: '100%', height: '80%' }}
                        ref={ref => this.mapView = ref}
                        mapType='hybrid'
                    >
                        {

                            this.state.steps.map((step, index) => {
                                return {
                                    coordinates: {
                                        latitude: step.meanLatitude,
                                        longitude: step.meanLongitude
                                    },
                                    image: step.masterImage == "" ? "sad" : step.masterImage,
                                    index: index,
                                    stepId: step.stepId
                                }
                            })
                            .map((el) => (
                                <Marker
                                    key={el.index + 'marker'}
                                    coordinate={el.coordinates}
                                    style={this.state.lastStepClicked.stepId == el.stepId ? styles.largeImageBox : styles.imageBox}
                                    onPress={(e) => this.onMarkerPress(e, el.stepId)}
                                >
                                    <View key={el.index + 'markerview'} style={this.state.lastStepClicked.stepId == el.stepId ? styles.largeImageBox : styles.imageBox} >
                                        <Image
                                            key={el.index + 'markerimage'}
                                            style={this.state.lastStepClicked.stepId == el.stepId ? styles.largeImageBox : styles.imageBox} source={{ uri: el.image }}></Image>

                                        {this.state.lastStepClicked.stepId == el.stepId ? <Text style={{ color: 'white', fontStyle: 'italic' }}>{this.state.lastStepClicked.description}</Text> : <View />}
                                    </View>
                                </Marker>
                            ))
                        }
                    </MapView>
                    <Callout>
                        <TouchableOpacity onPress={this.onBackPress.bind(this)} style={{ padding: 10 }} >
                            <Icon size={40} style={{ padding: 10 }} name='x' />
                        </TouchableOpacity>
                    </Callout>
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
                            onDismiss={this.onPhotoModalClose}
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
