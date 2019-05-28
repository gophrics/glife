import * as React from 'react'
import { Modal, TextInput, Button, SafeAreaView } from 'react-native'
var ImagePicker = require("react-native-image-picker")


interface IProps {
    visible: boolean
    onDone: any
}

interface IState {

}

export class NewStepPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onLocationTextChange = () => {

    }

    onImagePickerPress = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            // Same code as in above section!
            console.log(response)
          });
    }

    render() {
        return (
                <Modal visible={this.props.visible}>
                <SafeAreaView>
                    <TextInput placeholder={"Location"} onChangeText={this.onLocationTextChange.bind(this)} />
                    <Button title={"Image Picker"} onPress={this.onImagePickerPress.bind(this)} />
                    <Button title={"Close"} onPress={this.props.onDone} />
            </SafeAreaView>
                </Modal>
        )
    }
}