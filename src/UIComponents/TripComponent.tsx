import * as React from 'react';
import { View, Text } from 'react-native';
import { templateElement } from '@babel/types';

interface IState {

}

interface IProps {
    location? : string
    temperature? : number
    daysOfTravel?: number
    distanceTravelled? : number
    activities: Array<string>
}

export class TripComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15, borderWidth: 2}}>
                <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                    <Text style={{flex: 10, fontSize: 18}}>{this.props.location}</Text>
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
                        this.props.activities.map((val, index) => (
                            <Text key={index} style={{alignSelf: 'flex-end', fontSize: 14}}>{val}</Text>
                        ))
                    }
                </View>
            </View>
        )
    }
}