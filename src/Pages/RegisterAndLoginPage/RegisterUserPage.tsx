import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
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
    error: string
}

export class RegisterUserPage extends React.Component<IProps, IState> {

    Controller: RegisterAndLoginController;

    constructor(props: IProps) {
        super(props)
        this.Controller = new RegisterAndLoginController()
        this.state = {
            email: "",
            password: "",
            phone: "",
            registering: false,
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
        if(registered) {
            this.props.setPage(Page[Page.SEARCH])
        } else {
            this.setState({
                registering: false,
                error: this.Controller.error
            })
        }
    }

    registerUsingGoogle = async() => {
        this.setState({
            registering: true
        })
        var registered: boolean = await this.Controller.RegisterUsingGoogle()
        if(registered) {
            this.props.setPage(Page[Page.SEARCH])
        } else {
            this.setState({
                registering: false,
                error: this.Controller.error
            })
        }
    }

    login = () => {
        this.props.setPage(Page[Page.LOGIN])
    }

    render() {
        return (
            <View style={{alignContent:'center', flex:1, flexDirection:'column', width: '100%', justifyContent: "center"}}>
                {
                    this.state.registering ? 
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ActivityIndicator size='large' />
                        </View>
                    : <View />
                }
                <TextInput  style={{fontSize: 22, padding: 5, margin: 10, alignSelf:"center", width: '50%'}}  placeholder={"Enter Email"} onChangeText={this.onEmailChange} />
                <TextInput  style={{fontSize: 22, padding: 5, margin: 10, alignSelf:"center",width: '50%'}}  placeholder={"Enter Phone"} onChangeText={this.onPhoneChange} />
                <TextInput  style={{fontSize: 22, padding: 5, margin: 10, alignSelf:"center",width: '50%'}}  placeholder={"Enter Password"} onChangeText={this.onPasswordChange} />
                <View style={{alignSelf:"center", margin: 10, flexDirection:"row", height:'5%'}}>
                    <TouchableOpacity style={{backgroundColor:'white', margin: 10, padding: 5, borderRadius: 5, width: '20%', height:'100%'}} onPress={this.register} >
                        <Text style={{fontSize: 18, color:'black', textAlign:'center', alignSelf:'center', textAlignVertical:'center'}}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:'#00000000', margin: 10, padding: 5, borderRadius: 5, width: '20%', height:'100%'}} onPress={this.login} >
                        <Text style={{fontSize: 16, color:'white', textDecorationLine: 'underline', textAlign:'center', textAlignVertical:'center'}}>Login</Text>
                    </TouchableOpacity>
                </View>
                <GoogleSigninButton
                    style={{ width: 192, height: 48, alignSelf:"center", margin: 10 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.registerUsingGoogle}
                    disabled={this.state.registering}
                
                />
                <Text style={{fontSize: 18, color:'red'}}>{this.state.error}</Text>
            </View>
        )
    }
}