import * as React from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";

interface IProps {

}

interface IState {
    numberOfHomes: number
}

export class OnBoardingPage extends React.Component<IProps, IState> {

    homes: {[key: number]: any} = {};
    
    constructor(props: IProps) {
        super(props)
        this.state = {
            numberOfHomes: 1
        }
        console.log("OnBoardingPage");
    }

    onButtonClick = () => {
        this.setState({
            numberOfHomes: this.state.numberOfHomes + 1
        })
    }

    onConfirm = () => {

    }

    onCancel = () => {

    }

    render() {
        if(this.state == null) return (<View />)

        var textInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {
            textInputs.push(
                    <TextInput
                        key={i}
                        placeholder="Enter home city"
                    />)
                
            textInputs.push(<DateTimePicker
                isVisible={true}
                key={i + 'd'}
                onConfirm={this.onConfirm.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />)
        }

        var buttonInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {
            buttonInputs.push(<Text style={{alignSelf: 'center'}}>=</Text>)
            buttonInputs.push(<Text style={{alignSelf: 'center'}}>=</Text>)
        }

        return (
            <View style={{flexDirection:'row'}} >

                <View style={{flex: 1, alignSelf: 'flex-end'}}>
                    {
                        buttonInputs
                    }
                    <Button title={"+"} onPress={this.onButtonClick.bind(this)} />
                </View>
                <View style={{flexDirection: 'column', flex: 9}}>
                    {
                        textInputs
                    }
                </View>
            </View>
        )
    }
}