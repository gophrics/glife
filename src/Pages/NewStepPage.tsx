import * as React from 'react'
import { Text, Image, Modal, TextInput, Button, SafeAreaView } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { StepModal } from '../Modals/StepModal';
import { TravelUtils } from '../Utilities/TravelUtils';
import ImageDataModal from '../Modals/ImageDataModal';
import Region from '../Modals/Region';
import { ClusterModal } from '../Modals/ClusterModal';
import { ClusterProcessor } from '../Utilities/ClusterProcessor';

interface IProps {
    visible: boolean,
    onClose: (_step: StepModal|null) => void
}

interface IState {
    showPicker: boolean
    imageUris: string[]
}

export class NewStepPage extends React.Component<IProps, IState> {
    data: any
    calenderCursor: number = 0;
    from: Date = new Date(0);
    to: Date = new Date();

    constructor(props: IProps) {
        super(props)
        this.data = {
            'images': []
        }
        this.state = {
            showPicker: false,
            imageUris: []
        }
    }

    onLocationTextChange = (location: string) => {
        this.data['location'] = location
    }

    onImagePickerPress = () => {
        ImagePicker.openPicker({
            multiple: true
          }).then(images => {
            console.log(images);
            this.data['images'] = images;
            var imageUris: string[] = []
            for(var item of this.data['images']) {
                imageUris.push(item.sourceURL)
            }
            this.setState({
                imageUris: imageUris
            })
          });
    }

    onCalenderClick = (index: number) => {
        this.calenderCursor = index;
        this.setState({
            showPicker: true
        })
    }

    onPickerConfirm = (date: string) => {
        if (this.calenderCursor == 0) {
            // From date
            this.from = new Date(date)
        } else if (this.calenderCursor == 1) {
            // To date
            this.to = new Date(date);
        }
        this.setState({
            showPicker: false
        })
    }

    onPickerCancel = () => {
        this.setState({
            showPicker: false
        })
    }

    onDone = async() => {
        if (this.data['images'].length == 0) {
            this.props.onClose(null)
            return
        }

        var res = await TravelUtils.getCoordinatesFromLocation(this.data['location'])
        res = res[0]

        var step = new StepModal()
        var imageDataList: Array<ImageDataModal> = []
        for (var image of this.data['images']) {
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
        this.props.onClose(_step)
    };
    
    render() {
        return (
            <Modal visible={this.props.visible}>
                <SafeAreaView style={{
                    width: "80%",
                    height: "90%",
                    borderRadius: 10,
                    margin: 50,
                    padding: 50,
                    backgroundColor:"#00000000"
                }}>
                <Text>Go ahead, select your images. We'll generate the step for you</Text>
                
                    <TextInput style={{ fontSize: 20, padding: 3, color: 'black', borderWidth: 2, borderRadius: 10 }} placeholder={"Location"} onChangeText={(text) => this.onLocationTextChange(text)} />
                
                    <Button title={"Image Picker"} onPress={this.onImagePickerPress.bind(this)} />
                    {
                        this.state.imageUris.map((image:string) => {
                            <Image source={{uri: image}} />
                        })
                    }
                    <Button title={"Done"} onPress={this.onDone} />
                </SafeAreaView>
            </Modal>
        )
    }
}