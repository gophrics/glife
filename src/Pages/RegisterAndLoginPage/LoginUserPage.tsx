import * as React from 'react'
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'
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
    error: string
}

export class LoginUserPage extends React.Component<IProps, IState> {

    Controller: RegisterAndLoginController;

    constructor(props: IProps) {
        super(props)
        this.Controller = new RegisterAndLoginController()

        this.state = {
            email: this.Controller.GetCachedEmail(),
            password: this.Controller.GetCachedPassword(),
            loginInProcess: false,
            error: ""
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
        else {
            this.setState({
                loginInProcess: false,
                error: this.Controller.error
            })
        }
    }

    loginUsingGoogle = async() => {
        this.setState({
            loginInProcess: true
        })

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log(userInfo)
        var registered: boolean = await this.Controller.LoginUsingGoogle(this.state.email, userInfo.idToken || "")
        if(registered)
            this.props.setPage(Page[Page.SEARCH])
        else {
            console.log(this.Controller.error)
            this.setState({
                loginInProcess: false,
                error: this.Controller.error
            })
        }
    }

    render() {
        return (
            <View style={{alignContent:'center', flex:1, flexDirection:'column', width: '100%', justifyContent: "center"}}>
                <TextInput style={{fontSize: 22, padding: 5, margin: 10, alignSelf:"center", width: '50%'}} placeholder={"Enter Email"} onChangeText={this.onEmailChange} />
                <TextInput style={{fontSize: 22, padding: 5, margin: 10, alignSelf:"center", width: '50%'}} placeholder={"Enter Password"} onChangeText={this.onPasswordChange} />
                <TouchableOpacity style={{backgroundColor:'white', padding: 5, borderRadius: 5, margin: 10, width: '20%', height:'5%', alignSelf:'center'}} onPress={this.login} >
                    <Text style={{color:'black', fontSize:18, textAlign:'center', alignSelf:'center', textAlignVertical:'center'}}>Login</Text>
                </TouchableOpacity>
                <GoogleSigninButton
                    style={{ width: 192, height: 48, alignSelf:'center' }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.loginUsingGoogle}
                    disabled={this.state.loginInProcess}
                />
                <Text style={{fontSize: 18, color:'red'}}>{this.state.error}</Text>
            </View>
        )
    }
}