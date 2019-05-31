import * as React from 'react'
import { Image, View, TextInput, Button, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { ClusterModal } from '../Modals/ClusterModal';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';

interface IProps {
    onDone: (page: string, data: any) => void
}

interface IState {
    numberOfHomes: number,
    showPicker: boolean,
    dates: any
}

export class OnBoardingPage extends React.Component<IProps, IState> {

    homes: { name: string, timestamp: number }[] = [];

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

        //Buggy
        for (var i = 0; i <= this.cursor; i++) {
            if (this.homes[i] == undefined) return false;
        }
        return true
    }


    onButtonClick = () => {
        if (!this.validateData()) return;
        this.setState({
            numberOfHomes: this.state.numberOfHomes + 1
        })
        this.cursor++;
    }

    onPickerConfirm = (date: string) => {
        if(this.homes.length <= this.cursor) this.homes.push({name: "", timestamp: 0})

        var dates = this.state.dates;
        var dateObject: Date = new Date(date)
        dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
        this.homes[this.cursor].timestamp = dateObject.getTime();
        this.setState({
            showPicker: false,
            dates: dates
        })
        this.onButtonClick();
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
        this.cursor = pos
        if(this.homes.length <= this.cursor) this.homes.push({name: "", timestamp: NaN})
        this.homes[pos].name = text
    }

    onNextButtonClick = () => {
        // TODO: Fetch using API, the geocodes

        /*
        homesClusterModal.push({
            latitude:  37.763804,
            longitude: -122.438588,
            timestamp: NaN//this.timestamps[0]
        } as ClusterModal)
        

        homesClusterModal.push({
            latitude: 37.763804,
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
        */

        if(this.validateData()) {
            this.props.onDone(Page[Page.LOADING], this.homes)
        }
        else {

        }
    }

    render() {
        if (this.state == null) return (<View />)

        var inputs = []
        for (var i = 0; i < this.state.numberOfHomes; i++) {
            inputs.push(
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', width: '90%', alignContent: 'center', justifyContent: 'center' }}>
                        <TextInput
                            key={i}
                            placeholder="Enter home city"
                            onChangeText={(text) => this.onLocationTextChange(i - 1, text)}
                            style={{ fontSize: 20, padding: 3, color: 'black', borderWidth: 2, borderRadius: 10 }}
                            textContentType={'addressCity'}
                        />
                        <Text style={{ color: 'black', marginBottom: 20 }}>{i == 0 ? "Long long ago" : this.state.dates[i - 1]} - {this.state.dates[i] ? this.state.dates[i] : "Current"}</Text>
                    </View>
                    <TouchableOpacity key={i} onPress={() => this.onCalenderClick(i - 1)}>
                        <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../Assets/icons8-calendar-52.png')} />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View>

                <DateTimePicker
                    isVisible={this.state.showPicker}
                    onConfirm={this.onPickerConfirm.bind(this)}
                    onCancel={this.onPickerCancel.bind(this)}
                />
                <View style={{ marginTop: 20, flexDirection: 'column' }} >
                    {inputs}
                </View>
                <Button title="Done" onPress={this.onNextButtonClick} />
            </View>
        )
    }
}