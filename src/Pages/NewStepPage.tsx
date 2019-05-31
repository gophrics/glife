import * as React from 'react'
import { View, TouchableOpacity, Text, Image, Modal, TextInput, Button, SafeAreaView } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';

interface IProps {
    visible: boolean,
    onClose: any
}

interface IState {
    showPicker: boolean
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
            showPicker: false
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

    onDone = () => {
        this.props.onClose(this.data)
    };
    
    render() {
        return (
            <Modal visible={this.props.visible}>
                <SafeAreaView style={{
                    width: "80%",
                    height: "90%",
                    borderRadius: 10,
                }}>
                <Text>Go ahead, select your images. We'll generate the step for you</Text>
                
                    <TextInput placeholder={"Location"} onChangeText={(text) => this.onLocationTextChange(text)} />
                
                    <Button title={"Image Picker"} onPress={this.onImagePickerPress.bind(this)} />
                    {/*
                    <View style={{position: 'absolute', left: 0}}>
                        <Text>From</Text>
                        <TouchableOpacity onPress={() => this.onCalenderClick(0)}>
                            <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../Assets/icons8-calendar-52.png')} />
                        </TouchableOpacity>
                        <Text>{this.from.getDate()+"-"+this.from.getMonth()+"-"+this.from.getFullYear()}</Text>
                    </View>
                    <View style={{position: 'absolute', right: 0}}>
                        <Text>To</Text>
                        <TouchableOpacity onPress={() => this.onCalenderClick(1)}>
                            <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../Assets/icons8-calendar-52.png')} />
                        </TouchableOpacity>
                        <Text>{this.to.getDate()+"-"+this.to.getMonth()+"-"+this.to.getFullYear()}</Text>
                    </View>
                    */}
                    {
                        this.data['images'].map((image:any) => {
                            <Image source={{uri: image.uri}} />
                        })
                    }
                    <Button title={"Done"} onPress={this.onDone} />
                </SafeAreaView>
            </Modal>
        )
    }
}