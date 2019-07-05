import * as React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { OnBoardingPageController } from './OnBoardingPageController';
import { Page } from '../../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    valid: boolean
    location: string
}

export class AskForLocationPage extends React.Component<IProps, IState> {

    Controller: OnBoardingPageController;
    cursor: number
    constructor(props: IProps) {
        super(props)
        this.state = {
            valid: true,
            location: ""
        }
        this.Controller = new OnBoardingPageController()
        console.log(this.Controller.GetAllHomesData())
        this.cursor = this.Controller.GetAllHomesData().length - 1;
    }

    validateData = async (): Promise<boolean> => {
        var culprits: Array<number> = await this.Controller.validateAndGetCulprits()

        this.setState({
            valid: culprits[this.cursor] == 0
        })

        return culprits[this.cursor] == 0;
    }

    onLocationChange = (text: string) => {
        this.Controller.onLocationChangeText(this.cursor, text)
    }

    onNextButtonClick = async () => {
        if (await this.validateData())
            this.props.setPage(Page[Page.ONBOARDING])
    }

    setLocation = (obj: any) => {
        this.Controller.onLocationChangeText(this.cursor, obj.name.trim() + ", " + obj.country.trim())
        this.setState({
            location: obj.name.trim() + ", " + obj.country.trim()
        })
        this.validateData()
    }

    render() {

        return (
            <View>
                {
                    this.cursor == 0 ?
                        <View>
                            <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Where do you currently stay, {this.Controller.GetName()}?</Text>
                            <TextInput
                                style={[{ alignSelf: "center", textAlign: 'center', fontSize: 22, padding: 3, color: 'white' }, { borderWidth: this.state.valid ? 0 : 1, borderColor: this.state.valid ? "" : "darkred" }]}
                                placeholder={"Enter home"}
                                onChangeText={this.onLocationChange}>{this.state.location}</TextInput>
                        </View>
                        :
                        <View>
                            <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>From where did you move to {this.Controller.GetHomeData(this.cursor - 1).name}?</Text>
                            <TextInput
                                style={[{ alignSelf: "center", textAlign: 'center', fontSize: 22, padding: 3, color: 'white' }, { borderWidth: this.state.valid ? 0 : 1, borderColor: this.state.valid ? "" : "darkred" }]}
                                placeholder={"Enter home"}
                                onChangeText={this.onLocationChange}>{this.state.location}</TextInput>
                        </View>
                }
                {
                    !this.state.valid?
                            <Text style={{ color: 'red', padding: 3, alignSelf:'center' }} >{this.Controller.culprits[this.cursor] == 1 ? "Try nearest city, the digital overlords can't find this place in the map" : "Be more specific, multiple places with same name exist. Try Bangalore, India\nPlaces found:" }</Text>
                    : <View />
                }
                <View style={{alignSelf:'center'}}>
                {!this.state.valid && this.Controller.GetTempLocations()[this.cursor] ?
                    this.Controller.GetTempLocations()[this.cursor].map((el, index) => (
                        <Text style={{ color: 'lightgrey' }} onPress={(e: any) => this.setLocation(el)}>{"\n " + (index + 1) + ". " + el.name.trim() + ", " + el.country.trim() + "\n"}</Text>
                    )) : <View />}
                </View>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                    <Text style={{ fontSize: 22 }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }
}