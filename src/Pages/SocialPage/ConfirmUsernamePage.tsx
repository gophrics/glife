import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity, NativeModules,  } from 'react-native'
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
        var username = await NativeModules.GetRandomUsername()
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

        var result = await NativeModules.ValidateUsername(this.state.username)
        if(!result) return
        NativeModules.SetUsername(this.state.username)
        .then((res: any) => {
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