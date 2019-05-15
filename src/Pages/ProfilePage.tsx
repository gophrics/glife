import * as React from 'react';
import { View, Text } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';

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
        return (
            <View>
                <ProfileComponent />
                <WorldMapColouredComponent visitedCountryList={visitedCountryList}/> 
                <View style={{flexDirection: 'row', alignContent: 'stretch'}}>
                    <StatsAsCardComponent text={"You travelled 21% of the world"}/>
                    <StatsAsCardComponent text={"You've collected 36 flags"}/>
                </View>
            </View>
        )
    }
}