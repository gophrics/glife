import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../UIComponents/TripComponent';
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { ProfileModalInstance } from '../Modals/ProfileModalSingleton';

interface IState {
    bottom: number
}

interface IProps {
    setPage: any,
    data: any
}

export default class ProfilePage extends React.Component<IProps, IState> {
    tripRenderArray: any = []

    constructor(props: IProps) {
        super(props)
        for(var trip of this.props.data.trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress}/>)
            this.tripRenderArray.push(<View style={{height:10}} />)
        }
        this.state = {
            bottom: this.tripRenderArray.length*60
        }
        this.fetchProfileData()
    }

    fetchProfileData = () => {
        fetch('http://192.168.0.3:8081/api/v1/profile/getmyprofile', {
            method: 'post',
            body: JSON.stringify({
                'profileId': '1'
            })
        })
        .then((response) => {
            console.log(response)
        })
    }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.STEPEXPLORE], tripModal)
    }

    render() {

        var activities = Array<string>()
        activities.push("Hiking")
        activities.push("Parasailing")
        activities.push("Cultural Exchange")

        return (
                <ScrollView style={{flex: 1}} 
                    contentInset={{top: 0, bottom: this.state.bottom}}>
                    <ProfileComponent />
                    <WorldMapColouredComponent visitedCountryList={ProfileModalInstance.countriesVisited}/> 
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <StatsAsCardComponent text={"You travelled " + ProfileModalInstance.percentageWorldTravelled + "% of the world"}/>
                        <View style={{width:10}}/>
                        <StatsAsCardComponent text={"You've collected " + ProfileModalInstance.countriesVisited.length + " flags"}/>
                    </View>
                    <View style={{height: 10}}/>
                    {this.tripRenderArray}
                </ScrollView>
        )
    }
}