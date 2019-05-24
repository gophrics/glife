import * as React from 'react';
import { View, TouchableOpacity, Text } from "react-native";
import { StepModal } from '../Modals/StepModal';
import { TravelUtils } from '../Utilities/TravelUtils';

interface IProps {
    modal: StepModal
    daysOfTravel: number
    distanceTravelled: number
    onPress: any
}

interface IState {

}


export class StepComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }
    
    render() {

        var location = TravelUtils.getLocationFromCoordinates(this.props.modal.meanLatitude, this.props.modal.meanLongitude)
        var startDate = TravelUtils.getDateFromTimestamp(this.props.modal.startTimestamp)
        var endDate = TravelUtils.getDateFromTimestamp(this.props.modal.endTimestamp)
        var temperature = TravelUtils.getTemperatureFromLocationAndTime(this.props.modal.meanLatitude, this.props.modal.meanLongitude, this.props.modal.endTimestamp)
        var daysOfTravel = this.props.daysOfTravel
        var distanceTravelled = this.props.distanceTravelled

        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15, borderWidth: 2}}>
                    <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                        <Text style={{flex: 1, fontSize: 18}}>{location}</Text>
                        <Text style={{flex: 10, fontSize: 12}}>{startDate + " - "}{endDate ? endDate : "Present"}</Text>
                        {
                            // TODO: Don't forget to add degree celsius}
                        }
                        <Text style={{flex: 1, fontSize: 30}}>{temperature + "C"}</Text>
                    </View>
                    <View style={{flex: 3, flexDirection: 'column'}}>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{daysOfTravel + " days"}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{distanceTravelled + " km"}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{""}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{""}</Text>
                        {
                            //Add activities ?
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}