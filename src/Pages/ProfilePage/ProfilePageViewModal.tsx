import * as React from 'react';
import { View, Image, Text, RefreshControl, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ProfileComponent } from '../../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../../UIComponents/TripComponent';
import { TripModal } from '../../Engine/Modals/TripModal';
import { Page } from '../../Modals/ApplicationEnums';
import Icon from 'react-native-vector-icons/AntDesign';
import { ProfilePageController } from './ProfilePageController';

interface IState {
    bottom: number,
    coverPicURL: string
    profilePicURL: string
    refreshing: boolean
    tripRenderArray: Array<JSX.Element>

    percentageWorldTravelled: number
    flagsCollected: number
    visitedCountryList: Array<string>
}

interface IProps {
    setPage: any,
    setNavigator: any
}


const HEADER_MAX_HEIGHT = Dimensions.get('window').height * .66

export default class ProfilePageViewModal extends React.Component<IProps, IState> {

    Controller: ProfilePageController;
    constructor(props: IProps) {
        super(props)

        this.props.setNavigator(true)
        this.Controller = new ProfilePageController()

        
        this.state = {
            bottom: 200,
            coverPicURL: "",
            profilePicURL: "",
            refreshing: false,
            tripRenderArray: [],
            percentageWorldTravelled: 0,
            visitedCountryList: [],
            flagsCollected: 0
        }
        
        this.loadState();
    }

    loadState = async() => {
        await this.Controller.loadModal();
        this.setState({
            bottom: 200,
            coverPicURL: this.Controller.getCoverPicURL(),
            profilePicURL: this.Controller.getProfilePicURL(),
            refreshing: false,
            tripRenderArray: [],
            percentageWorldTravelled: this.Controller.getPercentageWorldTravelled(),
            visitedCountryList: this.Controller.getCountriesVisitedArray(),
            flagsCollected: (this.Controller.getNumberOfCountriesVisited())
        })
        this.getTrips()
    }

    getTrips = async() => {
        var trips = await this.Controller.getTrips()
        var tripRenderArray: Array<JSX.Element> = []
        for (var trip of trips) {
            tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress} />)
            tripRenderArray.push(<View key={trip.tripId + 'v'} style={{ height: 10 }} />)
        }
        this.setState({
            tripRenderArray: tripRenderArray
        })
    }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.TRIPEXPLORE], tripModal)
    }

    onProfilePicChange = (imageURL: string) => {
        this.setState({
            profilePicURL: imageURL
        })
        this.Controller.onProfilePicChange(imageURL)
    }

    newTripButtonPress = () => {
        this.props.setPage(Page[Page.NEWTRIP], null)
    }

    pickCoverPic = () => {
        this.Controller.onCoverPicChangePress()
        // .then((res: any) => {
        //     this.Controller.onCoverPicChange(res.path)
        //     this.setState({
        //         coverPicURL: res.path
        //     })
        // })
    }

    componentDidMount = () => {
        this.setState({})
    }

    _onRefresh = () => {
        this.props.setPage(Page[Page.LOADING])
    }

    render() {

        return (
            <View style={{ height: '100%' }} >

                <ScrollView contentContainerStyle={{ paddingBottom: 200}} style={{ flex: 1 }}
                    scrollEventThrottle={16}
                    contentInset={{ top: 0, bottom: this.state.bottom }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                    }>

                    <View style={styles.header}>
                        <Image
                            style={styles.backgroundImage}
                            source={{uri: this.state.coverPicURL }}
                        />
                        <TouchableOpacity style={{alignItems:'flex-end', padding: 20}} onPress={this.pickCoverPic} >
                            <Icon name='edit' size={25}/>
                        </TouchableOpacity>
                        <View style={styles.bar}>
                            <ProfileComponent profilePic={this.state.profilePicURL} onProfilePicChange={this.onProfilePicChange} />
                        </View>
                    </View>
                    <WorldMapColouredComponent visitedCountryList={this.state.visitedCountryList} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                        <StatsAsCardComponent text={"You travelled " + this.state.percentageWorldTravelled + "% of the world"} />
                        <View style={{ width: 10 }} />
                        <StatsAsCardComponent text={"You've collected " + this.state.flagsCollected + " flags"} />
                    </View>
                    <View style={{ height: 10 }} />
                    {this.state.tripRenderArray}
                    {
                        this.state.tripRenderArray.length == 0 ? 
                            <View style={{height: 200}}>
                                <Text style={{textAlign:'center', fontSize:18, color:'orange', borderWidth: 1, margin: 5, borderColor: 'red', padding: 5}}>No trips were processed! Add more photos to your photo library and try again with correct details about your home. Or add a trip manually.</Text>
                                <View style={{flexDirection:'row', alignSelf:'center'}}>
                                    <TouchableOpacity  style={{width:100, marginTop: 10, marginRight: 10, backgroundColor:'white', padding: 5, borderRadius: 10, alignSelf:'center'}} onPress={(e) => { this.props.setPage(Page[Page.ONBOARDING])}} >
                                        <Text style={{textAlign:'center'}}>Try again</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={{width:100, marginTop: 10, backgroundColor:'white', padding: 5, borderRadius: 10, alignSelf:'center'}} onPress={(e) => { this.props.setPage(Page[Page.NEWTRIP])}} >
                                        <Text style={{textAlign:'center'}}>Add Trip</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        : <View style={{height: 200}} />
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    bar: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: HEADER_MAX_HEIGHT
    },
})