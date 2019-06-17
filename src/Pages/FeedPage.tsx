import * as React from 'react'
import { View, TextInput, TouchableOpacity,  } from 'react-native'
import { ProfileUtils } from '../Utilities/ProfileUtils';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import { SettingsModal } from '../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {
    username: string
}

export class FeedPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            username: ProfileUtils.GenerateUsername()
        }
    }

    onUsernameChange = (text: string) => {
        this.setState({
            username: text
        })
    } 

    confirmUsername = () => {
        ProfileUtils.SetUsername((BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING]) as SettingsModal).profileId,
            this.state.username)
        .then((res) => {
            if(res) {
                this.props.setPage(Page[Page.SEARCH])
            }
        })
    }

    render() {
        return (
            <View>
                <TextInput placeholder={"Enter username"} onChangeText={this.onUsernameChange}/>
                <TouchableOpacity onPress={this.confirmUsername}/>
            </View>
        )
    }
}