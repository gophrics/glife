import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { templateElement } from '@babel/types';

interface IState {

}

interface IProps {
    onPress: any
    location? : string
    temperature? : number
    daysOfTravel?: number
    distanceTravelled? : number
    activities?: Array<string>
    startDate?: string
    endDate?: string
}

export class TripComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15, borderWidth: 2}}>
                    <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                        <Text style={{flex: 1, fontSize: 18}}>{this.props.location}</Text>
                        <Text style={{flex: 10, fontSize: 12}}>{this.props.startDate + " - "}{this.props.endDate ? this.props.endDate : "Present"}</Text>
                        {
                            // TODO: Don't forget to add degree celsius}
                        }
                        <Text style={{flex: 1, fontSize: 30}}>{this.props.temperature + "C"}</Text>
                    </View>
                    <View style={{flex: 3, flexDirection: 'column'}}>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{this.props.daysOfTravel + " days"}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{this.props.distanceTravelled + " km"}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{""}</Text>
                        <Text style={{alignSelf: 'flex-end', fontSize: 18}}>{""}</Text>
                        {
                            this.props.activities ? this.props.activities.map((val, index) => (
                                <Text key={index} style={{alignSelf: 'flex-end', fontSize: 14}}>{val}</Text>
                            )) : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}