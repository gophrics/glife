import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { TripModal } from '../Engine/Modals/TripModal';
import { TripUtils } from '../Engine/Utils/TripUtils';
import Icon from 'react-native-vector-icons/AntDesign';

interface IState {
    location: string
}

interface IProps {
    tripModal: TripModal
    onPress: (tripModal: TripModal) => void
}

const deviceHeight = Dimensions.get('window').height
export class TripComponent extends React.Component<IProps, IState> {

    retryCount = 20;
    style = StyleSheet.create({
        main: {
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            height: deviceHeight*.25,
            backgroundColor: 'grey'
        }
    })

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
        TripUtils.getLocationFromCoordinates(this.props.tripModal.location.latitude,
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

    //'#98FB98', '#228B22']
    //'#ccac00', '#ffe766'
    async render() {
        var masterPic = await this.props.tripModal.masterPicBase64
        if(masterPic == "") masterPic = this.props.tripModal.masterPicURL
        else masterPic = `data:image/gif;base64,${masterPic}`

        return (
            <TouchableOpacity onPress={(e) => this.props.onPress(this.props.tripModal)} >
            <ImageBackground resizeMode='cover' source={{uri: masterPic}} style={this.style.main}>
                <View style={{width: "100%", padding: 10, flexDirection: 'row', flexGrow: 1, borderRadius: 15}}>
                    {
                        !this.props.tripModal.syncComplete ? 
                            <Icon name='sync' size={25} />
                        : <View />
                    }
                    <View style={{flexDirection: 'column', width:'40%', justifyContent:'space-between'}}>
                        <View>
                        <Text style={{color: 'white', fontSize: 18}}>{this.props.tripModal.tripName}</Text>
                        <Text style={{color: 'white', fontSize: 12}}>{this.props.tripModal.startDate + "\n"}{this.props.tripModal.endDate ? "" : "On-going"}</Text>
                        </View>
                        {
                            // TODO: Don't forget to add degree celsius}
                        }
                        <Text style={{fontSize: 30, color:'white'}}>{this.props.tripModal.temperature}</Text>
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
            </ImageBackground>
            </TouchableOpacity>
        )
    }
}