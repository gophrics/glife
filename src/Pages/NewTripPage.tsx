import * as React from 'react'
import { View, Button, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { StepModal } from '../Modals/StepModal';
import { TravelUtils } from '../Utilities/TravelUtils';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';

interface IProps {
    setPage: any
}

interface IState {
    showPicker: boolean
}

export class NewTripPage extends React.Component<IProps, IState> {
    calenderCursor: number = 0;
    from: Date = new Date(0);
    to: Date = new Date();
    tripTitle: string = "";
    myData: any

    constructor(props: IProps) {
        super(props)
        this.state = {
            showPicker: false
        }
        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP])
    }

    onTitleChange = (title: string) => {
        this.tripTitle = title
    }

    onCalenderClick = (index: number) => {
        this.calenderCursor = index;
        this.setState({
            showPicker: true
        })
    }

    onPickerCancel = () => {

        this.setState({
            showPicker: false
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

    onNextClick = () => {
        var trip: TripModal = new TripModal();
        trip.startDate = this.from.getDay() + "-" + this.from.getMonth() + "-" + this.from.getFullYear()
        trip.endDate = this.to.getDay() + "-" + this.to.getMonth() + "-" + this.to.getFullYear()
        trip.title = this.tripTitle;
        trip.daysOfTravel = Math.floor((this.to.getTime() - this.from.getTime()) / 8.64e7)

        var homeStep: StepModal = new StepModal();
        homeStep.startTimestamp = this.from.getTime()
        homeStep.endTimestamp = this.from.getTime() + 3600000;
        homeStep.meanLatitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude

        trip.tripAsSteps.push(homeStep)

        var profileData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        profileData.trips.push(trip)
        this.props.setPage(Page[Page.PROFILE], profileData)
    }

    render() {

        return (
            <View>
                <DateTimePicker
                    isVisible={this.state.showPicker}
                    onConfirm={this.onPickerConfirm.bind(this)}
                    onCancel={this.onPickerCancel.bind(this)}
                />
                <TextInput placeholder="Enter title" style={{fontSize: 20, borderWidth: 3, borderRadius: 5, padding: 5}} onChangeText={(text) => this.onTitleChange(text)} />
                <View style={{flexDirection:'row'}}>
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
                </View>
                <View style={{marginTop: 100}}>
                    <Button title={"Next"} onPress={this.onNextClick.bind(this)} />
                </View>
            </View>
        )
    }
}