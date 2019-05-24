import * as React from 'react'
import { Image, View, TextInput, Button, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { ClusterModal } from '../Modals/ClusterModal';

interface IProps {
    onDone: (data: any) => void
}

interface IState {
    numberOfHomes: number,
    showPicker: boolean,
    dates: any
}

export class OnBoardingPage extends React.Component<IProps, IState> {

    homes: {[key: number]: string} = {};
    timestamps: {[key:number]: number} = {}

    cursor: number = 0

    constructor(props: IProps) {
        super(props)
        this.state = {
            numberOfHomes: 1,
            showPicker: false,
            dates: {}
        }
    }

    validateData = () => {
        console.log(this.cursor);
        console.log(this.homes);
        console.log(this.state.dates);
        for(var i = 0; i <= this.cursor; i++) {
            if(this.homes[i] == undefined || this.state.dates[i] == undefined) return false;
        }
        return true
    }


    onButtonClick = () => {
        if(!this.validateData()) return;
        this.setState({
            numberOfHomes: this.state.numberOfHomes + 1
        })
        this.cursor++;
    }

    onPickerConfirm = (date: string) => {
        var dates = this.state.dates;
        var dateObject: Date = new Date(date)
        dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
        this.timestamps[this.cursor] = dateObject.getTime();
        this.setState({
            showPicker: false,
            dates: dates
        })
    }

    onPickerCancel = () => {
        this.setState({
            showPicker: false
        })
    }

    onCalenderClick = (pos: number) => {
        this.setState({
            showPicker: true
        })
        this.cursor = pos
    }

    onLocationTextChange = (pos: number, text: string) => {
        console.log(pos);
        this.cursor = pos
        this.homes[pos] = text
        console.log(this.homes);
    }

    onNextButtonClick = () => {
        // TODO: Fetch using API, the geocodes
        var homesClusterModal: ClusterModal[] = [];

        /*
        homesClusterModal.push({
            latitude:  37.763804,
            longitude: -122.438588,
            timestamp: NaN//this.timestamps[0]
        } as ClusterModal)
        */
        
        homesClusterModal.push({
            latitude:  37.763804,
            longitude: -122.438588,
            timestamp: 1464030230000//this.timestamps[1]
        } as ClusterModal)

        homesClusterModal.push({
            latitude: 15.390570,
            longitude: 73.878204,
            timestamp: 1464036771000//this.timestamps[2]
        } as ClusterModal)
        
        homesClusterModal.push({
            latitude: 12.902886,
            longitude: 77.675271,
            timestamp: 1540327971000//this.timestamps[2]
        } as ClusterModal)

        homesClusterModal.push({
            latitude: 17.449202,
            longitude: 78.370166,
            timestamp: NaN//this.timestamps[2]
        } as ClusterModal)
        
        this.props.onDone(homesClusterModal)
    }

    render() {
        if(this.state == null) return (<View />)

        var textInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {
            textInputs.push(
                    <TextInput
                        key={i}
                        placeholder="Enter home city"
                        onChangeText={(text) => this.onLocationTextChange(i-1, text)}
                        style={{fontSize: 16, borderWidth: 2, borderRadius: 10}}
                        />)
            textInputs.push(
                <Text>{i == 0 ? "Long long ago" : this.state.dates[i-1]} - {this.state.dates[i] ? this.state.dates[i] : "Current"}</Text>
            )
        }

        var buttonInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {
            buttonInputs.push(<Text style={{alignSelf: 'center'}}>=</Text>)
            buttonInputs.push(<Text style={{alignSelf: 'center'}}>=</Text>)
        }

        var calenderInputs = []
        for(var i = 0; i < this.state.numberOfHomes; i++) {  
            calenderInputs.push(
                <TouchableOpacity key={i} onPress={() => this.onCalenderClick(i-1)}>
                    <Image style={{width: 30, height: 30}} source={require('../Assets/Poke-Ball-256.png')}/>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{flexDirection:'row'}} >
                <DateTimePicker
                    isVisible={this.state.showPicker}
                    onConfirm={this.onPickerConfirm.bind(this)}
                    onCancel={this.onPickerCancel.bind(this)}
                />
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
                <View style={{flex: 1, alignSelf: 'center'}}>
                    {
                        calenderInputs
                    }
                </View>
                <Button title="Done" onPress={this.onNextButtonClick} />
            </View>
        )
    }
}