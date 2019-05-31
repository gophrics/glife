import * as React from 'react';
import { View, Button, ScrollView } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../UIComponents/TripComponent';
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';

interface IState {
    bottom: number
}

interface IProps {
    setPage: any,
    setNavigator: any
}

export default class ProfilePage extends React.Component<IProps, IState> {
    tripRenderArray: any = []

    myData: any = {}

    constructor(props: IProps) {
        super(props)

        this.props.setNavigator(true)
        this.myData = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]]
        console.log(this.myData.countriesVisited)
        for(var trip of this.myData.trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress}/>)
            this.tripRenderArray.push(<View key={trip.tripId+'v'} style={{height:10}} />)
        }
        this.state = {
            bottom: this.tripRenderArray.length*60
        }
    }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.STEPEXPLORE], tripModal)
    }

    newTripButtonPress = () => {
        this.props.setPage(Page[Page.NEWTRIP], null)
    }

    render() {

        return (
                <ScrollView style={{flex: 1}} 
                    contentInset={{top: 0, bottom: this.state.bottom}}>
                    {
                        //<ProfileComponent />
                    }
                    <WorldMapColouredComponent visitedCountryList={this.myData.countriesVisited}/> 
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <StatsAsCardComponent text={"You travelled " + this.myData.percentageWorldTravelled + "% of the world"}/>
                        <View style={{width:10}}/>
                        <StatsAsCardComponent text={"You've collected " + this.myData.countriesVisited.length + " flags"}/>
                    </View>
                    <View style={{height: 10}}/>
                    {this.tripRenderArray}
                </ScrollView>
        )
    }
}