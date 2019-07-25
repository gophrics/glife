import * as React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { OnBoardingPageController } from './OnBoardingPageController';
import { Page } from '../../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    name: string
    lastHome: string
    valid: boolean
    location: string
    templocations: Array<string>
}

export class AskForLocationPage extends React.Component<IProps, IState> {

    Controller: OnBoardingPageController;

    constructor(props: IProps) {
        super(props)
        this.state = {
            name: "",
            lastHome: "",
            valid: true,
            location: "",
            templocations: []
        }
        this.Controller = new OnBoardingPageController()
        this.loadState()
    }

    loadState = async() => {
        await this.Controller.loadHomeData()
        this.setState({
            name: await this.Controller.GetName(),
            lastHome: (await this.Controller.GetLastHomeData()).name
        })
    }

    validateData = async (): Promise<boolean> => {
        var result = await this.Controller.validate(this.state.location)

        this.setState({
            valid: result.length == 0,
            templocations: result
        })

        return result.length == 0
    }

    onLocationChange = (text: string) => {
        this.setState({
            location: text
        })
    }

    onNextButtonClick = async () => {
        console.log(this.state.location)
        if (await this.validateData()) {
            this.Controller.SetLastHomeLocation(this.state.location)
            this.props.setPage(Page[Page.ONBOARDING])
        }
    }

    setLocation = (obj: any) => {
        this.setState({
            location: obj.name.trim() + ", " + obj.country.trim()
        })
        this.validateData()
    }

    render() {

        if(!this.Controller.homeDataLoaded) {
            return (
                <View />
            )
        }

        return (
            <View>
                {
                    !this.Controller.FirstHomeFilled() ?
                        <View>
                            <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Where do you currently stay, {this.state.name}?</Text>
                            <TextInput
                                style={[{ alignSelf: "center", textAlign: 'center', fontSize: 22, padding: 3, color: 'white' }, { borderWidth: this.state.valid ? 0 : 1, borderColor: this.state.valid ? "" : "darkred" }]}
                                placeholder={"Enter home"}
                                onEndEditing={this.validateData}
                                onChangeText={this.onLocationChange}>{this.state.location}</TextInput>
                        </View>
                        :
                        <View>
                            <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>From where did you move to {this.state.lastHome}?</Text>
                            <TextInput
                                style={[{ alignSelf: "center", textAlign: 'center', fontSize: 22, padding: 3, color: 'white' }, { borderWidth: this.state.valid ? 0 : 1, borderColor: this.state.valid ? "" : "darkred" }]}
                                placeholder={"Enter home"}
                                onEndEditing={this.validateData}
                                onChangeText={this.onLocationChange}>{this.state.location}</TextInput>
                        </View>
                }
                {
                    !this.state.valid?
                            <Text style={{ color: 'red', padding: 3, alignSelf:'center' }} >{this.state.templocations.length == 0 ? "Try nearest city, the digital overlords can't find this place in the map" : "Be more specific, multiple places with same name exist. Try Bangalore, India\nPlaces found:" }</Text>
                    : <View />
                }
                <View style={{alignSelf:'center'}}>
                {!this.state.valid?
                    this.state.templocations.map((el, index) => (
                        <Text style={{ color: 'lightgrey' }} onPress={(e: any) => this.setLocation(el)}>{"\n " + (index + 1) + ". " + el + "\n"}</Text>
                    )) : <View />}
                </View>
                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                    <Text style={{ fontSize: 22 }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }
}