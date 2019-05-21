import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../UIComponents/TripComponent';

interface IState {

}

interface IProps {

}

export default class ProfilePage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)

        this.fetchProfileData()
    }

    fetchProfileData = () => {
        fetch('http://localhost:8081/api/v1/profile/getmyprofile', {
            method: 'post',
            body: JSON.stringify({
                'profileId': '1'
            })
        })
        .then((response) => {
            console.log(response)
        })
    }

    onTripPress = () => {

    }

    render() {
        var visitedCountryList = Array<string>()
        visitedCountryList.push("US")
        visitedCountryList.push("IN")

        var activities = Array<string>()
        activities.push("Hiking")
        activities.push("Parasailing")
        activities.push("Cultural Exchange")
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ScrollView>
                    <ProfileComponent />
                    <WorldMapColouredComponent visitedCountryList={visitedCountryList}/> 
                    <View style={{flexDirection: 'row'}}>
                        <StatsAsCardComponent text={"You travelled 21% of the world"}/>
                        <StatsAsCardComponent text={"You've collected 36 flags"}/>
                    </View>

                    <View>
                        <TripComponent location={"Hyderabad"} 
                            temperature={41} daysOfTravel={14} 
                            distanceTravelled={2340} activities={activities} 
                            startDate="30 Oct 18"
                            onPress={this.onTripPress.bind(this)}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}