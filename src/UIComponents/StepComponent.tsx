import * as React from 'react';
import { View, TouchableOpacity, Text, Button, Dimensions } from "react-native";
import { StepModal } from '../Modals/StepModal';
import { TravelUtils } from '../Utilities/TravelUtils';

interface IProps {
    modal: StepModal
    daysOfTravel: number
    distanceTravelled: number
    onPress: any
}

interface IState {
    location: string,
    temperature: number,
}

const deviceWidth = Dimensions.get('window').width
export class StepComponent extends React.Component<IProps, IState> {

    retryCount = 20;
    constructor(props: IProps) {
        super(props)
        this.state = {
            location: "Loading..",
            temperature: 0
        }
        var temperature = TravelUtils.getTemperatureFromLocationAndTime(this.props.modal.meanLatitude, this.props.modal.meanLongitude, this.props.modal.endTimestamp)
        this.setState({
            temperature: temperature
        })
        this.getLocation();
    }

    getLocation() {
        if(this.retryCount <= 0) return;
        this.retryCount--
        TravelUtils.getLocationFromCoordinates(this.props.modal.meanLatitude, this.props.modal.meanLongitude)
        .then((res: any) => {
            if(res.address) {
                var district: string = res.address.state_district
                if(district == undefined) district = res.address.county
                if(district.toLowerCase().endsWith("district")) district = district.substring(0, district.length-8)
                this.setState({
                    location: district
                })
            } else {
                this.getLocation();
            }
        })
    }

    shareStep = () => {

    }

    onPress = (e: any) => {
        this.props.onPress(this.props.modal)
    }
    
    render() {

        return (
            <TouchableOpacity onPress={this.onPress.bind(this)} style={{width: deviceWidth*3/4}}>
                <Text style={{alignSelf: 'center', fontSize: 30, color:'white'}}>{"Day " + this.props.daysOfTravel}</Text>
                <View style={{flexDirection:'column', height:"75%", marginLeft:5, marginRight:5, padding:10, borderRadius: 15, borderWidth: 2}}>
                    <View style={{width: "100%", flexDirection: 'row', flexGrow: 1}}>
                        
                        <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                            <Text style={{flex: 1, fontSize: 18, color: 'white'}}>{this.state.location}</Text>
                            {
                                // TODO: Don't forget to add degree celsius}
                            }
                            <Text style={{flex: 1, fontSize: 40, color: 'white'}}>{this.state.temperature + " C"}</Text>
                        </View>
                        
                        <View style={{flex: 3, flexDirection: 'column'}}>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.distanceTravelled + " km"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.modal.imageUris.length + " photos taken"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{""}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{""}</Text>
                            {
                                //Add activities ?
                            }
                        </View>
                    </View>
                    {/*
                    <View style={{alignSelf:'center'}}>
                        <Button title={"Share"} onPress={this.shareStep.bind(this)} />
                    </View>
                    */}
                </View>
            </TouchableOpacity>
        )
    }
}