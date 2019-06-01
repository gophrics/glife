import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';
import { WorldMapColouredComponent } from '../UIComponents/WorldMapColouredComponent';
import { StatsAsCardComponent } from '../UIComponents/StatsAsCardComponent';
import { TripComponent } from '../UIComponents/TripComponent';
import { TripModal } from '../Modals/TripModal';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';

interface IState {
    bottom: number,
    scrollY: Animated.Value
}

interface IProps {
    setPage: any,
    setNavigator: any
}


const HEADER_MAX_HEIGHT = Dimensions.get('window').height * .6
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class ProfilePage extends React.Component<IProps, IState> {
    tripRenderArray: any = []

    myData: any = {}
    constructor(props: IProps) {
        super(props)

        this.props.setNavigator(true)
        this.myData = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]]
        for (var trip of this.myData.trips) {
            this.tripRenderArray.push(<TripComponent key={trip.tripId} tripModal={trip} onPress={this.onTripPress} />)
            this.tripRenderArray.push(<View key={trip.tripId + 'v'} style={{ height: 10 }} />)
        }
        this.state = {
            bottom: this.tripRenderArray.length * 60,
            scrollY: new Animated.Value(0),
        }
    }

    onTripPress = (tripModal: TripModal) => {
        this.props.setPage(Page[Page.STEPEXPLORE], tripModal)
    }

    newTripButtonPress = () => {
        this.props.setPage(Page[Page.NEWTRIP], null)
    }

    render() {

        return (
            <View style={{ height: '100%' }}>

                <Animated.View style={[styles.header, {
                    height: this.state.scrollY.interpolate({
                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                        extrapolate: 'extend',
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
                        source={require('../Assets/glife_logo.png')}
                    />
                    <View style={styles.bar}>
                        <ProfileComponent />
                    </View>
                </Animated.View>
                <ScrollView style={{ flex: 1 }}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}
                    contentInset={{ top: 0, bottom: this.state.bottom }}>
                    <WorldMapColouredComponent visitedCountryList={this.myData.countriesVisited} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
        top: 0,
        left: 0,
        right: 0,
        width: undefined,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
})