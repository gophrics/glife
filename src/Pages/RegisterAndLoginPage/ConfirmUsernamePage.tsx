import * as React from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { RegisterAndLoginController } from './RegisterAndLoginController';
import { Page } from '../../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    username: string
    validUsername: boolean
}


export class ConfirmUsernamePage extends React.Component<IProps, IState> {

    Controller: RegisterAndLoginController;
    constructor(props: IProps) {
        super(props)
        this.Controller = new RegisterAndLoginController()
        this.state = {
            username: "",
            validUsername: true
        }
    }

    getRandomUsername = async() => {
        var username = await this.Controller.GetRandomUsername()
        this.setState({
            username: username
        })
    }

    validateUsername = async() => {
        var validUsername = await this.Controller.ValidateUsername(this.state.username)
        this.setState({
            validUsername: validUsername
        })
    }
    
    onDonePress = async() => {
        await this.validateUsername()
        if(this.state.username.trim() != "" && this.state.validUsername) {
            this.props.setPage(Page[Page.SEARCH])
        }
    }

    render() {
        return (
            <View style={{flex: 1, }}>
                <TextInput style={{fontSize: 22, color:'white'}} placeholder={this.state.username} />
                <TouchableOpacity onPress={this.onDonePress} >
                    <Text style={{color:'white'}}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }
}