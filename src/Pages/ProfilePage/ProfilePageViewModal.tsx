import * as React from 'react';
import { View, Text, RefreshControl, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { ProfileComponent } from '../../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../../UIComponents/TripComponent';
import { TripExplorePageModal } from '../TripExplorePage/TripExplorePageModal';
import { Page } from '../../Modals/ApplicationEnums';
import Icon from 'react-native-vector-icons/AntDesign';
import { ProfilePageController } from './ProfilePageController';

interface IState {
    bottom: number,
    scrollY: Animated.Value,
    coverPicURL: string
    profilePicURL: string
    refreshing: boolean
}

interface IProps {
    setPage: any,
    setNavigator: any
}


const HEADER_MAX_HEIGHT = Dimensions.get('window').height * .66
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class ProfilePageViewModal extends React.Component<IProps, IState> {
    tripRenderArray: any = []

    Controller: ProfilePageController;
    constructor(props: IProps) {
        super(props)

        this.props.setNavigator(true)
        this.Controller = new ProfilePageController()

        var trips = this.Controller.getTrips()
        for (var trip of trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress} />)
            this.tripRenderArray.push(<View key={trip.tripId + 'v'} style={{ height: 10 }} />)
        }

        this.state = {
            bottom: 200,
            scrollY: new Animated.Value(0),
            coverPicURL: this.Controller.getCoverPicURL() == undefined || this.Controller.getCoverPicURL() == "" ? "https://cms.hostelworld.com/hwblog/wp-content/uploads/sites/2/2017/08/girlgoneabroad.jpg" : this.Controller.getCoverPicURL(),
            profilePicURL: this.Controller.getProfilePicURL() == undefined || this.Controller.getCoverPicURL() == "" ? "https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg" : this.Controller.getProfilePicURL(),
            refreshing: false
        }
    }

    onTripPress = (tripModal: TripExplorePageModal) => {
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
        .then((res: any) => {
            this.Controller.onCoverPicChange(res.path)
            this.setState({
                coverPicURL: res.path
            })
        })
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
                    scrollEventThrottle={1}
                    onScroll={Animated.event(	
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}
                    contentInset={{ top: 0, bottom: this.state.bottom }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                    }
                    >

                <Animated.View style={[styles.header, {
                    height: this.state.scrollY.interpolate({
                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT]
                    })
                }]}>
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            
                        ]}
                        source={{uri: this.state.coverPicURL }}
                    />
                    <TouchableOpacity style={{alignItems:'flex-end', padding: 20}} onPress={this.pickCoverPic} >
                        <Icon name='edit' size={25}/>
                    </TouchableOpacity>
                    <View style={styles.bar}>
                        <ProfileComponent scrollY={this.state.scrollY} HEADER_SCROLL_DISTANCE={HEADER_SCROLL_DISTANCE} profilePic={this.state.profilePicURL} onProfilePicChange={this.onProfilePicChange} />
                    </View>
                </Animated.View>
                    <WorldMapColouredComponent visitedCountryList={this.Controller.getCountriesVisitedArray()} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                        <StatsAsCardComponent text={"You travelled " + this.Controller.getPercentageWorldTravelled() + "% of the world"} />
                        <View style={{ width: 10 }} />
                        <StatsAsCardComponent text={"You've collected " + this.Controller.getNumberOfCountriesVisited() + " flags"} />
                    </View>
                    <View style={{ height: 10 }} />
                    {this.tripRenderArray}
                    {
                        this.tripRenderArray.length == 0 ? 
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