import * as React from 'react'
import { Image, Button, View, TextInput, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native'
import { HomeDataModal, Page } from '../../Modals/ApplicationEnums';
import Icon from 'react-native-vector-icons/AntDesign';
import { OnBoardingPageController } from './OnBoardingPageController';

interface IProps {
    navigatorVisible: boolean
    setPage: (page: string) => void
}

interface IState {
    showPicker: boolean,
    validationInProgress: boolean
    culprits: Array<number>,
    homes: Array<HomeDataModal>

    name: string
    lastHomeTimestamp: number
}

export class OnBoardingPageViewModal extends React.Component<IProps, IState> {

    cachedDate: Date = new Date();
    Controller: OnBoardingPageController;

    constructor(props: IProps) {
        super(props)
        
        this.Controller = new OnBoardingPageController()
        this.state = {
            showPicker: false,
            validationInProgress: false,
            culprits: [0],
            homes: this.Controller.GetAllHomesData(),
            name: "",
            lastHomeTimestamp: 0
        }

        this.loadState();
    }
    
    loadState = async() => {
        this.setState({
            name: await this.Controller.GetName(),
            lastHomeTimestamp: (await this.Controller.GetLastHomeData()).timestamp
        })
    }

    getTempLocations = () => {
        return this.Controller.GetTempLocations()
    }

    validateData = async () => {
        this.setState({
            validationInProgress: true
        })
        
        var culprits: Array<number> = await this.Controller.validateAndGetCulprits()

        this.setState({
            validationInProgress: false,
            culprits: culprits
        })

        return this.state.culprits.indexOf(1) == -1 && this.state.culprits.indexOf(2) == -1;
    }

    onLocationTextChange = (pos: number, text: string) => {
        this.Controller.SetCursor(pos)
        this.Controller.onLocationChangeText(pos, text)
        this.setState({
            homes: this.Controller.GetAllHomesData()
        })
    }

    onNextButtonClick = () => {
        this.validateData()
            .then((res) => {
                if (res) {
                    //this.Controller.SetAllHomeData(this.state.homes)
                    this.props.setPage(Page[Page.LOADING])
                }
            })
    }

    onDeleteHome = (pos: number) => {
        this.Controller.onDeleteHome(pos)

        this.setState({
            homes: this.Controller.GetAllHomesData(),
        })
    }

    setLocation = (index: number, obj: any) => {
        this.onLocationTextChange(index, obj.name.trim() + ", " + obj.country.trim())
        this.setState({
            homes: this.Controller.GetAllHomesData()
        })

        this.validateData()
    }

    onNewHome = () => {            
        this.Controller.onNewHomeClick()
        this.props.setPage(Page[Page.ASKFORDATE])
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.state.name}</Text>
                    <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Add your past home cities</Text>
                    <Text style={{ marginTop: 12, fontSize: 22, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>You could add later too ;)</Text>
                </View>
                <View style={{ flex: 1, height: '100%' }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 200}}  style={{ flex: 1, marginTop: 5, padding: 20, flexGrow: 1}} contentInset={{ bottom: 500 + this.state.homes.length*50}} >
                        {
                            this.state.homes.map((home, i) => (
                                <View key={i + 'a'} style={{ flexDirection: 'row', alignSelf:'center'}}>
                                    <View style={{ flexDirection: 'column', alignSelf:'center'}}>
                                        <TextInput
                                            editable={true}
                                            onEndEditing={this.validateData}
                                            placeholder={(i == 0) ? "Your most recent home city" : "Your previous home city"}
                                            onChangeText={(text) => this.onLocationTextChange(i, text)}
                                            style={[{ fontSize: 22, padding: 3, color: 'white', textAlign: 'center' }, { borderWidth: ((this.state.culprits[i] != 0) ? 1 : 0), borderColor: ((this.state.culprits[i] != 0) ? 'red' : 'white') }]}
                                            textContentType={'addressCity'}
                                        >{home.name}</TextInput>
                                        {this.state.culprits[i] != 0 ? <Text style={{ color: 'red', padding: 3 }} > {this.state.culprits[i] == 1 ? "Try nearest city, the digital overlords can't find this place in the map" : "Be more specific, multiple places with same name exist. Try Bangalore, India"} </Text> : <View />}
                                        {this.state.culprits[i] == 2 ? <Text style={{ color: 'lightgrey', padding: 3 }}>Places found: </Text> : <View />}
                                        {this.state.culprits[i] == 2 && this.getTempLocations()[i] != undefined? 
                                            this.getTempLocations()[i].map((el, index) => (
                                                <Text style={{ color: 'lightgrey'}} onPress={(e: any) => this.setLocation(i, el)}>{"\n " + (index+1) + ". " + el.name.trim() + ", " + el.country.trim() + "\n"}</Text>
                                            )) : <View />}
                                        <Text style={{ color: 'white', fontSize: 20, marginBottom: 20, textAlign:'center'  }}>{home.timestamp == 0 ? "Long long ago" : this.Controller.GetDateAsString(home.timestamp)} - {i == 0 ? "Current" : this.Controller.GetDateAsString(this.state.lastHomeTimestamp)}</Text>
                                    </View>
                                    {i != 0 ?
                                    <TouchableOpacity onPress={() => this.onDeleteHome(i)}>
                                        <Icon name='closecircle' size={30} />
                                    </TouchableOpacity>
                                    : <View />}
                                </View>
                            ))
                        }
                        <Button title={"Add New"} onPress={this.onNewHome} />
                        
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                            <Text style={{ fontSize: 22 }}>Next</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}