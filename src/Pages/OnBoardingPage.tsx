import * as React from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import DatePicker from 'react-native-datepicker'

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

    render() {
        if(this.state == null) return (<View />)

        var textInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {
            textInputs.push(
                    <TextInput
                        placeholder="Enter home city"
                    />)
            textInputs.push(<DatePicker />)
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