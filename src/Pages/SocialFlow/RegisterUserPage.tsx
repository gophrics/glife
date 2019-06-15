import * as React from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AuthProvider, RegisterUserModal, LoginUserModal } from '../../Utilities/AuthProvider'
import { Page } from '../../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../../Utilities/BlobSaveAndLoad';
import { SettingsModal } from '../../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {
    name: string
    country: string
    email: string
    phone: string
    password: string
    isSigninInProgress: boolean
    errorText: string
}

export class RegisterUserPage extends React.Component<IProps, IState> {
    myData: any

    constructor(props: IProps) {
        super(props)
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
    
    register = () => {
        AuthProvider.LoginUser({
            Email: this.state.email,
            Password: this.state.password
        } as RegisterUserModal)
        .then((res) => {
            if(res) {
                this.props.setPage(Page[Page.HOME]);
            }
        })
    }

    login = () => {
        this.props.setPage(Page[Page.LOGIN])
    }
    
    signUpUsingGoogle = async () => {
        try {
            this.setState({
                isSigninInProgress: true
            })
            var res = await AuthProvider.RegisterUserWithGoogle({
                Name: this.state.name,
                Email: this.state.email,
                Country: this.state.country,
                Phone: this.state.phone
            } as RegisterUserModal)

            var settings: SettingsModal = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING])
            settings.profileId = res.id;
            BlobSaveAndLoad.Instance.setBlobValue(Page[Page.SETTING], settings)
            
            this.props.setPage(Page[Page.CONFIRMUSERNAME])
        } catch (error) {
            this.setState({
                isSigninInProgress: false,
                errorText: "Sign up failed"
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
                <Button title={"Register"} onPress={this.register} />                
                <Button title={"Login"} onPress={this.login} />
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signUpUsingGoogle}
                    disabled={this.state.isSigninInProgress || this.myData.loggedIn}
                />
                <Text>{this.state.errorText}</Text>
            </View>
        )
    }
}