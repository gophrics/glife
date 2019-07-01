import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity,  } from 'react-native'
import { ProfileUtils } from '../../Engine/ProfileUtils';
import { Page } from '../../Modals/ApplicationEnums';

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

        this.generateRandomUsername()
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

    confirmUsername = async () => {

        var result = await ProfileUtils.ValidateUsername(this.state.username)
        if(!result) return
        ProfileUtils.SetUsername(this.state.username)
        .then((res) => {
            if(res) {
                this.props.setPage(Page[Page.SEARCH])
            }
        })
    }

    render() {
        return (
            <View>
                <TextInput placeholder={"Enter username"} onChangeText={this.onUsernameChange}>
                    {this.state.username}
                </TextInput>
                <TouchableOpacity onPress={this.confirmUsername}><Text>Done</Text></TouchableOpacity>
            </View>
        )
    }
}