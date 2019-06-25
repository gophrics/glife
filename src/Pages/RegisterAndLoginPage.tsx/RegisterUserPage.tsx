import * as React from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Page } from '../../Modals/ApplicationEnums';
import { RegisterAndLoginController } from './RegisterAndLoginController';

interface IProps {
    setPage: any
}

interface IState {
    email: string,
    phone: string,
    password: string
    registering: boolean
}

export class RegisterUserPage extends React.Component<IProps, IState> {

    Controller: RegisterAndLoginController;

    constructor(props: IProps) {
        super(props)
        this.Controller = new RegisterAndLoginController()
    }

    onEmailChange = (email: string) => {
        this.setState({
            email: email
        })
    }

    onPasswordChange = (password: string) => {
        this.setState({
            password: password
        })
    }

    onPhoneChange = (phone: string) => {
        this.setState({
            phone: phone
        })
    }

    register = async() => {
        this.setState({
            registering: true
        })
        var registered: boolean = await this.Controller.Register(this.state.email, this.state.password, this.state.phone)
        if(registered)
            this.props.setPage(Page[Page.CONFIRMUSERNAME])
        else
            this.setState({
                registering: false
            })
    }

    registerUsingGoogle = async() => {
        this.setState({
            registering: true
        })
        var registered: boolean = await this.Controller.RegisterUsingGoogle()
        if(registered)
            this.props.setPage(Page[Page.CONFIRMUSERNAME])
        else
            this.setState({
                registering: false
            })
    }

    login = () => {
        this.props.setPage(Page[Page.LOGIN])
    }

    render() {
        return (
            <View>
                <TextInput placeholder={"Enter Email"} onChangeText={this.onEmailChange} />
                <TextInput placeholder={"Enter Phone"} onChangeText={this.onPhoneChange} />
                <TextInput placeholder={"Enter Password"} onChangeText={this.onPasswordChange} />
                <Button title={"Register"} onPress={this.register} />                
                <Button title={"Login"} onPress={this.login} />
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.registerUsingGoogle}
                    disabled={this.state.registering}
                />
            </View>
        )
    }
}