import * as React from 'react';
import { View } from 'react-native';
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
                <StatsAsCardComponent />
            </View>
        )
    }
}