import * as React from 'react'
import { View, Button, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { StepModal } from '../Modals/StepModal';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';

interface IProps {
    setPage: any
}

interface IState {
    showPicker: boolean
}

export class NewTripPage extends React.Component<IProps, IState> {
    calenderCursor: number = 0;
    to: Date = new Date();
    from: Date = new Date(this.to.getTime()-365*24*60*60*1000);
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
                <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Enter the trip name. Add the steps later.</Text>
                <View style={{justifyContent:'center', height: '60%', padding: 20}}>
                    <TextInput placeholder="Enter trip name" style={{fontSize: 20, color:'white', padding: 5, alignSelf:'center'}} onChangeText={(text) => this.onTitleChange(text)} />
                
                </View>

                <View style={{justifyContent:'center', alignContent:'center', backgroundColor:'white', margin:10, borderRadius: 5, padding: 10}}>
                    <TouchableOpacity onPress={this.onNextClick.bind(this)}>
                        <Text style={{fontSize:22, textAlign:'center'}}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}