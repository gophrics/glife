import * as React from 'react'
import { View, Text } from 'react-native'
import { SearchPageController } from './SearchPageController';
import { SearchBar } from 'react-native-elements';
import { Page } from '../../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    search: string
}


export class SearchPage extends React.Component<IProps, IState> {

    Controller: SearchPageController;

    constructor(props: IProps) {
        super(props)

        this.state = {
            search: ""
        }

        this.Controller = new SearchPageController();
        if(this.Controller.getAuthToken() == "")
        this.props.setPage(Page[Page.REGISTER])
    }

    updateSearch = (search: string) => {
        this.Controller.searchString(search)
    }

    render() {
        return (
            <View>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                />
                <View>

                </View>
            </View>
        )
    }
}