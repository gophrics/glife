import * as React from 'react'
import { View, TextInput, Button } from 'react-native'
import { GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AuthProvider, RegisterUserModal, LoginUserModal } from '../../Engine/AuthProvider'
import { Page } from '../../Modals/ApplicationEnums';

interface IProps{ 
    setPage: any
}

interface IState{
    name: string
    country: string
    email: string
    phone: string
    password: string
    isSigninInProgress: boolean
}

export class LoginUserPage extends React.Component<IProps, IState> {
    myData: any
    constructor(props: IProps) {
        super(props)
        this.myData = {}
    }

    onEmailChange = (data: string) => {
        this.setState({
            email: data
        })
    }

    onPasswordChange = (data: string) => {
        this.setState({
            password: data
        })
    }

    login = () => {
        AuthProvider.LoginUser({
            Email: this.state.email,
            Password: this.state.password
        } as LoginUserModal)
        .then((res) => {
            if(res) {
                this.props.setPage(Page[Page.HOME]);
            }
        })
    }

    signUpUsingGoogle = async () => {
        try {
            this.setState({
                isSigninInProgress: true
            })
            AuthProvider.RegisterUserWithGoogle({
                Name: this.state.name,
                Email: this.state.email,
                Country: this.state.country,
                Phone: this.state.phone
            } as RegisterUserModal)
        } catch (error) {
            this.setState({
                isSigninInProgress: false
            })

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }

    render() {
        return (
            <View>
                <TextInput onChangeText={this.onEmailChange} />
                <TextInput onChangeText={this.onPasswordChange} />
                <Button title={"Login"} onPress={this.login} />
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signUpUsingGoogle}
                    disabled={this.state.isSigninInProgress || this.myData.loggedIn}
                />
            </View>
        )
    }
}