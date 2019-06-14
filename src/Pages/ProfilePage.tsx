import * as React from 'react';
import { View, RefreshControl, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../UIComponents/TripComponent';
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { AuthProvider } from '../Utilities/AuthProvider';
import { GoogleSignin } from 'react-native-google-signin';

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


const HEADER_MAX_HEIGHT = Dimensions.get('window').height * .6
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default class ProfilePage extends React.Component<IProps, IState> {
    tripRenderArray: any = []

    myData: MapPhotoPageModal;
    constructor(props: IProps) {
        super(props)

        this.props.setNavigator(true)
        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        for (var trip of this.myData.trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress} />)
            this.tripRenderArray.push(<View key={trip.tripId + 'v'} style={{ height: 10 }} />)
        }

        this.state = {
            bottom: 100,
            scrollY: new Animated.Value(0),
            coverPicURL: this.myData.coverPicURL,
            profilePicURL: this.myData.profilePicURL,
            refreshing: false
        }
    }



  signInGoogleSilently = async () => {
    try {
    const userInfo = await GoogleSignin.signIn();
    AuthProvider.LoginUserWithGoogle(userInfo.user.email, userInfo.idToken)
    .then((res) => {
      if(res) {
        var data = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING]) || {}
        data.loginProvider = 'GOOGLE'
        data.loggedIn = true
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.SETTING], data)
      }
    })
    } catch(error) {
      // User not registered
      console.log(error)
    }
  }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.STEPEXPLORE], tripModal)
    }

    onProfilePicChange = (imageURL: string) => {
        console.log(imageURL)
        this.myData.profilePicURL = imageURL;
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], this.myData)
        this.setState({
            profilePicURL: imageURL
        })
    }

    newTripButtonPress = () => {
        this.props.setPage(Page[Page.NEWTRIP], null)
    }

    pickCoverPic = () => {
        ImagePicker.openPicker({
          }).then((image: any) => {
            this.myData.coverPicURL = image.path;
            BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], this.myData)
            this.setState({
                coverPicURL: image.path
            })
          });
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

                <ScrollView style={{ flex: 1 }}
                    scrollEventThrottle={16}
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
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                        extrapolate: 'clamp',
                    })
                }]}>
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                opacity: this.state.scrollY.interpolate({
                                    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
                                    outputRange: [1, 1, 0],
                                    extrapolate: 'clamp',
                                }), transform: [{
                                    translateY: this.state.scrollY.interpolate({
                                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                                        outputRange: [0, -50],
                                        extrapolate: 'clamp',
                                    })
                                }]
                            },
                        ]}
                        source={{uri: this.state.coverPicURL}}
                    />
                    <TouchableOpacity style={{alignItems:'flex-end', padding: 20}} onPress={this.pickCoverPic} >
                        <Icon name='edit' size={25}/>
                    </TouchableOpacity>
                    <View style={styles.bar}>
                        <ProfileComponent scrollY={this.state.scrollY} HEADER_SCROLL_DISTANCE={HEADER_SCROLL_DISTANCE} profilePic={this.state.profilePicURL} onProfilePicChange={this.onProfilePicChange} />
                    </View>
                </Animated.View>
                    <WorldMapColouredComponent visitedCountryList={this.myData.countriesVisited} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                        <StatsAsCardComponent text={"You travelled " + this.myData.percentageWorldTravelled + "% of the world"} />
                        <View style={{ width: 10 }} />
                        <StatsAsCardComponent text={"You've collected " + this.myData.countriesVisited.length + " flags"} />
                    </View>
                    <View style={{ height: 10 }} />
                    {this.tripRenderArray}

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