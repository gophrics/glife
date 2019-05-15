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
            <ScrollView>
                <ProfileComponent />
                <WorldMapColouredComponent visitedCountryList={visitedCountryList}/> 
                <View style={{flexDirection: 'row', alignContent: 'stretch'}}>
                    <StatsAsCardComponent text={"You travelled 21% of the world"}/>
                    <StatsAsCardComponent text={"You've collected 36 flags"}/>
                </View>

                <View>
                    <TripComponent location={"Hyderabad"} temperature={41} daysOfTravel={14} distanceTravelled={2340} activities={activities} />
                </View>
            </ScrollView>
        )
    }
}