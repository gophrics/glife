import * as React from 'react'
import { View, TextInput, Button } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AuthProvider, RegisterUserModal } from '../Utilities/AuthProvider';
import { Page } from '../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    name: string
    email: string
    phone: string
    country: string
    isSigninInProgress: boolean
}

export class RegisterUserPage extends React.Component<IProps, IState> {

    myData: any;

    constructor(props: IProps) {
        super(props)

        this.myData = {};
    }

    onNameChange = (data: string) => {
        this.setState({
            name: data
        })
    }

    onEmailChange = (data: string) => {
        this.setState({
            email: data
        })
    }   

    onPhoneChange = (data: string) => {
        this.setState({
            phone: data
        })
    }

    onCountryChange = (data: string) => {
        this.setState({
            country: data
        })
    }

    registerManual = () => {
        AuthProvider.RegisterUser({
            Name: this.state.name,
            Email: this.state.email,
            Phone: this.state.phone,
            Country: this.state.country
        })
        .then((res) => {
            if(res) {
                this.props.setPage(Page[Page.HOME])
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
            <View style={{justifyContent:'center', alignContent:'center'}}>
                <TextInput onChangeText={this.onNameChange} placeholder="Enter Name" />
                <TextInput onChangeText={this.onEmailChange} placeholder="Enter Email" />
                <TextInput onChangeText={this.onPhoneChange} placeholder="Enter Phone" />
                <TextInput onChangeText={this.onCountryChange} placeholder="Enter Country" />
                <Button title={"Submit"} onPress={this.registerManual} />
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