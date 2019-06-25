import * as React from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { GoogleSigninButton, GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Page } from '../../Modals/ApplicationEnums';
import { RegisterAndLoginController } from './RegisterAndLoginController';

interface IProps {
    setPage: any
}

interface IState {
    email: string,
    password: string
    loginInProcess: boolean
}

export class LoginUserPage extends React.Component<IProps, IState> {

    Controller: RegisterAndLoginController;

    constructor(props: IProps) {
        super(props)
        this.Controller = new RegisterAndLoginController()

        this.state = {
            email: "",
            password: "",
            loginInProcess: false
        }
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
    
    login = async() => {
        this.setState({
            loginInProcess: true
        })
        var registered: boolean = await this.Controller.Login(this.state.email, this.state.password)
        if(registered)
            this.props.setPage(Page[Page.SEARCH])
        else
            this.setState({
                loginInProcess: false
            })
    }

    loginUsingGoogle = async() => {
        this.setState({
            loginInProcess: true
        })

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        var registered: boolean = await this.Controller.LoginUsingGoogle(this.state.email, userInfo.idToken || "")
        if(registered)
            this.props.setPage(Page[Page.SEARCH])
        else
            this.setState({
                loginInProcess: false
            })
    }

    render() {
        return (
            <View>
                <TextInput placeholder={"Enter Email"} onChangeText={this.onEmailChange} />
                <TextInput placeholder={"Enter Password"} onChangeText={this.onPasswordChange} />
                <Button title={"Login"} onPress={this.login} />
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.loginUsingGoogle}
                    disabled={this.state.loginInProcess}
                />
            </View>
        )
    }
}