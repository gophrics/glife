import * as React from 'react';
import { View, TouchableOpacity, Text, Button, Dimensions, ImageBackground } from "react-native";
import { StepModal } from '../Modals/StepModal';

interface IProps {
    modal: StepModal
    daysOfTravel: number
    distanceTravelled: number
    onPress: any
}

interface IState {
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
export class StepComponent extends React.Component<IProps, IState> {

    retryCount = 20;
    constructor(props: IProps) {
        super(props)
        this.state = {
            temperature: 0
        }
    }

    shareStep = () => {

    }

    onPress = (e: any) => {
        this.props.onPress(this.props.modal)
    }
    
    render() {

        return (
            <TouchableOpacity onPress={this.onPress.bind(this)} >
                <ImageBackground resizeMode='cover' style={{width: deviceWidth*3/4, padding: 10, margin: 10, backgroundColor:'grey', height: deviceHeight*.2}} source={{uri: `data:image/gif;base64,${this.props.modal.masterImageBase64}`}}>
                    
                        <View style={{flexDirection: 'column', alignContent:'space-between'}}>
                            
                            <Text style={{color:'white'}}>{"Day " + this.props.daysOfTravel}</Text>

                            <Text style={{fontSize: 18, color: 'white'}}>{this.props.modal.location == "" ? "Unknown" : this.props.modal.location}</Text>
                            
                            {
                                // TODO: Don't forget to add degree celsius}
                            }
                            <Text style={{fontSize: 40, color: 'white'}}>{this.props.modal.temperature}</Text>
                        </View>
                        
                        <View style={{flexDirection: 'column', alignContent: 'space-between'}}>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.distanceTravelled + " km"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{this.props.modal.imageUris.length + " photos taken"}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{""}</Text>
                            <Text style={{alignSelf: 'flex-end', color: 'white', fontSize: 18}}>{""}</Text>
                            {
                                //Add activities ?
                            }
                        </View>
                    {/*
                    <View style={{alignSelf:'center'}}>
                        <Button title={"Share"} onPress={this.shareStep.bind(this)} />
                    </View>
                    */}
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}