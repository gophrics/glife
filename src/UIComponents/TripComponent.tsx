import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { TripModal } from '../Engine/Modals/TripModal';
import Icon from 'react-native-vector-icons/AntDesign';
import { Region } from "react-native-maps";


interface TripMeta{
    profileId: string
    tripId: string
    location : Region
    tripName: string
    countryCode: string[]
    temperature : string
    daysOfTravel: number
    distanceTravelled : number
    activities: Array<string>
    startDate: string
    endDate: string
    masterPic: string
    public: boolean
    syncComplete: boolean
}

interface IState {
    location: string
    masterPic: string
}

interface IProps {
    tripModal: TripMeta
    onPress: (tripModal: TripModal) => void
}

const deviceHeight = Dimensions.get('window').height
export class TripComponent extends React.Component<IProps, IState> {

    retryCount = 20;
    style = StyleSheet.create({
        main: {
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            height: deviceHeight*.25,
            backgroundColor: 'grey'
        }
    })

    constructor(props: IProps) {
        super(props)
        this.populateMasterImage();
    }

    populateMasterImage = () => {
        var masterPic = this.props.tripModal.masterPic
        this.state = {
            masterPic: masterPic,
            location: "..."
        }
    }

    //'#98FB98', '#228B22']
    //'#ccac00', '#ffe766'
    render() {
        return (
            <TouchableOpacity onPress={(e) => this.props.onPress(this.props.tripModal)} >
            <ImageBackground resizeMode='cover' source={{uri: this.state.masterPic}} style={this.style.main}>
                <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15}}>
                    {
                        !this.props.tripModal.syncComplete ? 
                            <Icon name='sync' size={25} />
                        : <View />
                    }
                    <View style={{flexDirection: 'column', width:'40%', justifyContent:'space-between'}}>
                        <View>
                        <Text style={{color: 'white', fontSize: 18}}>{this.props.tripModal.tripName}</Text>
                        <Text style={{color: 'white', fontSize: 12}}>{this.props.tripModal.startDate + "\n"}{this.props.tripModal.endDate ? "" : "On-going"}</Text>
                        </View>
                        {
                            // TODO: Don't forget to add degree celsius}
                        }
                        <Text style={{fontSize: 30, color:'white'}}>{this.props.tripModal.temperature}</Text>
                    </View>
                    <View style={{flex: 3, flexDirection: 'column'}}>
                        <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.tripModal.daysOfTravel + " days"}</Text>
                        <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.tripModal.distanceTravelled + " km"}</Text>
                        <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{""}</Text>
                        {
                            this.props.tripModal.activities ? this.props.tripModal.activities.map((val, index) => (
                                <Text key={index} style={{alignSelf: 'flex-end', color: 'white', fontSize: 14}}>{val}</Text>
                            )) : null
                        }
                    </View>
                </View>
            </ImageBackground>
            </TouchableOpacity>
        )
    }
}