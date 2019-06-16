import * as React from 'react'
import { View, Button, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { TripModal } from '../../Modals/TripModal';
import { Page } from '../../Modals/ApplicationEnums';
import { StepModal } from '../../Modals/StepModal';
import { BlobSaveAndLoad } from '../../Utilities/BlobSaveAndLoad';
import * as PhotoLibraryProcessor from '../../Utilities/PhotoLibraryProcessor';
import { TravelUtils } from '../../Utilities/TravelUtils';

interface IProps {
    setPage: any
}

interface IState {
    showPicker: boolean
    tripName: string
    valid: boolean
}

export class NewTripPage extends React.Component<IProps, IState> {
    calenderCursor: number = 0;
    from: Date = new Date();
    tripTitle: string = "";
    myData: any

    constructor(props: IProps) {
        super(props)
        this.state = {
            showPicker: false,
            tripName: "",
            valid: true
        }

        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP])
        PhotoLibraryProcessor.checkPhotoPermission()
        .then((res) => {
                if(!res) this.props.setPage(Page[Page.NOPERMISSIONIOS])
            }
        )
    }

    onTitleChange = (title: string) => {
        this.setState({
            tripName: title
        })
        this.validate()
    }

    validate = () => {
        if(this.state.tripName == "") {
            this.setState({
                valid: false
            }) 
            return false
        } 
        this.setState({
            valid: true
        })
        return true
    }

    onNextClick = () => {
       
        if(!this.validate()) return;

        var trip: TripModal = new TripModal();
        trip.startDate = this.from.getDay() + "-" + this.from.getMonth() + "-" + this.from.getFullYear()
        trip.endDate = trip.startDate;
        trip.title = this.state.tripName;
        trip.daysOfTravel = 0;

        var homeStep: StepModal = new StepModal();
        homeStep.startTimestamp = this.from.getTime()
        homeStep.endTimestamp = this.from.getTime() + 1 ; //milliseconds
        homeStep.meanLatitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude
        homeStep.location = "Home"
        homeStep.id = 1;

        trip.tripAsSteps.push(homeStep)
        homeStep = new StepModal()
        homeStep.startTimestamp = this.from.getTime() + 1;
        homeStep.endTimestamp = this.from.getTime() + 1;
        homeStep.meanLatitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].latitude
        homeStep.meanLongitude = this.myData[Math.floor(homeStep.startTimestamp / 8.64e7)].longitude        
        homeStep.location = "Home"
        homeStep.id = 100000;
        trip.tripAsSteps.push(homeStep)

        trip.tripId = TravelUtils.GenerateTripId()
        var profileData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        profileData.trips.push(trip)
        this.props.setPage(Page[Page.PROFILE], profileData)
    }

    render() {

        return (
            <View>
                <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Enter the trip name. Add the steps later.</Text>
                <View style={{justifyContent:'center', height: '60%', padding: 20}}>
                    <TextInput placeholder="Enter trip name" style={{fontSize: 20, color:'white', padding: 5, alignSelf:'center', borderWidth: !this.state.valid ? 1 : 0, borderColor: 'red', borderRadius: 5}} onChangeText={(text) => this.onTitleChange(text)} />
                </View>

                <View style={{justifyContent:'center', width:'20%', alignSelf:'center', alignContent:'center', backgroundColor:'white', margin:10, borderRadius: 5, padding: 10}}>
                    <TouchableOpacity onPress={this.onNextClick.bind(this)}>
                        <Text style={{fontSize:22, textAlign:'center'}}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}