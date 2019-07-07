import * as React from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
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
    loading: boolean
}


export class SearchPageViewModal extends React.Component<IProps, IState> {

    Controller: SearchPageController;

    constructor(props: IProps) {
        super(props)

        this.state = {
            search: "",
            searchResults: [],
            loading: false
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
        this.setState({
            loading: true
        })
        var result = await this.Controller.Search(this.state.search)
        this.setState({
            loading: false,
            searchResults: result
        })
    }

    onTripPress = (tripModal: TripModal) => {
        this.setState({
            loading: true
        })
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
                <View>
                    {
                        this.state.loading ? 
                            <View style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ActivityIndicator size='large' />
                            </View>
                        : <View />
                    }
                    {
                        this.state.searchResults.length == 0 && this.state.search != "" && !this.state.loading ? 
                            <View style={{alignContent:'center', justifyContent:'center'}}>
                                <Text style={{color:'white', fontSize:22}}>No results found</Text>
                            </View>
                        : <View />
                    }
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
            </View>
        )
    }
}