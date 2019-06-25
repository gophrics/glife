import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity,  } from 'react-native'
import { ProfileUtils } from '../../Engine/ProfileUtils';
import { BlobSaveAndLoad } from '../../Engine/BlobSaveAndLoad';
import { Page } from '../../Modals/ApplicationEnums';
import { SettingsModal } from '../../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {
    username: string
}

export class ConfirmUsernamePage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            username: ""
        }
    }

    generateRandomUsername = async() => {
        var username = await ProfileUtils.GetRandomUsername()
        this.setState({
            username: username
        })
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
                <TouchableOpacity onPress={this.confirmUsername}><Text>Done</Text></TouchableOpacity>
            </View>
        )
    }
}