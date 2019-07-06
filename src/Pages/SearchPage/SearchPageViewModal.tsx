import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { SearchPageController } from './SearchPageController';
import { SearchBar } from 'react-native-elements';
import { Page } from '../../Modals/ApplicationEnums';
import { TripModal } from "../../Engine/Modals/TripModal";
import { TripComponent } from '../../UIComponents/TripComponent';

interface IProps {
    setPage: any
}

interface IState {
    search: string,
    searchResults: Array<TripModal>
}


export class SearchPageViewModal extends React.Component<IProps, IState> {

    Controller: SearchPageController;

    constructor(props: IProps) {
        super(props)

        this.state = {
            search: "",
            searchResults: []
        }

        this.Controller = new SearchPageController();
        if(!this.Controller.IsLoggedIn())
            this.props.setPage(Page[Page.REGISTER])
    }

    updateSearch = (search: string) => {
        this.setState({
            search: search
        })
    }

    search = async() => {
        var result = await this.Controller.Search(this.state.search)
        this.setState({
            searchResults: result
        })
    }

    onTripPress = (tripModal: TripModal) => {
        this.Controller.GetTrip(tripModal)
        .then((data) => {
           this.props.setPage(Page[Page.TRIPEXPLORE], data)
        })
    }

    render() {
        return (
            <View>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                    onEndEditing={this.search}
                />
                <ScrollView>
                    {
                        this.state.searchResults.map((el, index) => (
                            <View>
                                <TripComponent tripModal={el} onPress={this.onTripPress}/>
                                <View style={{height: '5%'}}/>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        )
    }
}