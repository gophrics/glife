import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TripModal } from '../Modals/TripModal';
import { TravelUtils } from '../Utilities/TravelUtils';
import { throwStatement } from '@babel/types';

interface IState {
    location: string
}

interface IProps {
    tripModal: TripModal
    onPress: (tripModal: TripModal) => void
}


export class TripComponent extends React.Component<IProps, IState> {

    retryCount = 20;

    constructor(props: IProps) {
        super(props)
        this.state = {
            location: "Loading...."
        }

        this.getLocations();
    }

    getLocations() {
        if(this.retryCount <= 0) return;
        this.retryCount--;
        TravelUtils.getLocationFromCoordinates(this.props.tripModal.location.latitude,
            this.props.tripModal.location.longitude)
        .then((res) => {
            if(res.address) {
                res = res.address.country
                this.setState({
                    location: res
                })
            } else {
                this.getLocations()
            }
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={(e) => this.props.onPress(this.props.tripModal)}>
                <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15, borderWidth: 2}}>
                    <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                        <Text style={{flex: 1, color: 'white', fontSize: 18}}>{this.props.tripModal.title}</Text>
                        <Text style={{flex: 2, color: 'white', fontSize: 12}}>{this.props.tripModal.startDate + "\n"}{this.props.tripModal.endDate ? this.props.tripModal.endDate : "Present"}</Text>
                        {
                            // TODO: Don't forget to add degree celsius}
                        }
                        <Text style={{flex: 1, fontSize: 30}}>{this.props.tripModal.temperature + "C"}</Text>
                    </View>
                    <View style={{width:40}}>
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
            </TouchableOpacity>
        )
    }
}