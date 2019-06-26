import * as React from 'react'
import { ScrollView } from 'react-native'
import { TripComponent } from '../../UIComponents/TripComponent';
import { FeedPageController } from './FeedPageController';
import { TripExplorePageModal } from '../TripExplorePage/TripExplorePageModal';

interface IProps {
    setPage: any
}

interface IState {
    trips: Array<TripExplorePageModal>
}

export class FeedPageViewModal extends React.Component<IProps, IState> {

    Controller: FeedPageController;
    constructor(props: IProps) {
        super(props)
        this.Controller = new FeedPageController()
        this.state = {
            trips: []
        }
    }

    getFeeds = async() => {
        var trips = await this.Controller.GetFeed()

        this.setState({
            trips: trips
        })
    }


    render() {
        return (
            <ScrollView>
                {
                    this.state.trips.map((trip, index) => (
                        <TripComponent tripModal={trip} onPress={this.Controller.onTripPress}/>
                    ))
                }
            </ScrollView>
        )
    }
}