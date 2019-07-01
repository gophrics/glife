import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { BlobProvider } from '../../Engine/Providers/BlobProvider';
import { Page } from '../../Modals/ApplicationEnums';
import { ProfilePageController } from '../ProfilePage/ProfilePageController';


interface IProps {
    setPage: any
    navigatorVisible: boolean
}

interface IState {
    name: string
    valid: boolean
}

const deviceHeight = Dimensions.get('window').height

export class PreOnBoardingPage extends React.Component<IProps, IState> {

    ProfilePageController: ProfilePageController;
    constructor(props: IProps) {

        super(props)
        this.state = {
            name: "",
            valid: true
        }
        this.ProfilePageController = new ProfilePageController();
    }

    validate = () => {
        return this.state.name != ""
    }

    onNameTextChange = (text: string) => {
        this.setState({
            name: text
        })
        this.validate()
    }

    onNextButtonClick = () => {
        if(this.state.name != "") {
            this.ProfilePageController.setName(this.state.name)
            this.props.setPage(Page[Page.ASKFORLOCATION])
        }
    }

    render() {
        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi.</Text>
                    <Text style={{ marginTop: 10, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>What's your name?</Text>
                </View>

                <View style={{ height: '100%', padding: 20 }}>
                    <TextInput
                        placeholder={"Enter name"}
                        onChangeText={(text) => this.onNameTextChange(text)}
                        style={[{ alignSelf:"center", textAlign:'center', fontSize: 22, padding: 3, color: 'white'}, { borderWidth: this.validate() ? 0 : 1, borderColor: this.validate() ? "" : "darkred" }]}
                        textContentType={'givenName'}
                    />
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10  }} onPress={this.onNextButtonClick}>
                        <Text style={{ fontSize: 22 }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}