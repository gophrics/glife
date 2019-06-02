import * as React from 'react';
import { View, TouchableOpacity, Text, Button, Dimensions } from "react-native";
import { StepModal } from '../Modals/StepModal';
import { TravelUtils } from '../Utilities/TravelUtils';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
    modal: StepModal
    daysOfTravel: number
    distanceTravelled: number
    onPress: any
}

interface IState {
    temperature: number,
}

const deviceWidth = Dimensions.get('window').width
export class StepComponent extends React.Component<IProps, IState> {

    retryCount = 20;
    constructor(props: IProps) {
        super(props)
        this.state = {
            temperature: 0
        }
        var temperature = TravelUtils.getTemperatureFromLocationAndTime(this.props.modal.meanLatitude, this.props.modal.meanLongitude, this.props.modal.endTimestamp)
        this.setState({
            temperature: temperature
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
                <Text style={{alignSelf: 'center', fontSize: 30, color:'black'}}>{"Day " + this.props.daysOfTravel}</Text>

                <View style={{flexDirection:'column', height:"75%", marginLeft:5, marginRight:5, padding:10, borderRadius: 15, backgroundColor:'lightgrey', borderWidth: 2}}>
                    <View style={{width: "100%", flexDirection: 'row', flexGrow: 1}}>
                        
                        <View style={{flex: 2, flexDirection: 'column', alignContent: 'flex-start'}}>
                            <Text style={{flex: 1, fontSize: 18, color: 'black'}}>{this.props.modal.location == "" ? "Unknown" : this.props.modal.location}</Text>
                            {
                                // TODO: Don't forget to add degree celsius}
                            }
                            <Text style={{flex: 1, fontSize: 40, color: 'black'}}>{this.state.temperature + " C"}</Text>
                        </View>
                        
                        <View style={{flex: 3, flexDirection: 'column'}}>
                            <Text style={{alignSelf: 'flex-end', color: 'black', fontSize: 18}}>{this.props.distanceTravelled + " km"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'black', fontSize: 18}}>{this.props.modal.imageUris.length + " photos taken"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'black', fontSize: 18}}>{""}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'black', fontSize: 18}}>{""}</Text>
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