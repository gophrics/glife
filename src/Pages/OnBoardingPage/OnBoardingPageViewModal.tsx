import * as React from 'react'
import { Image, Button, View, TextInput, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Page } from '../../Modals/ApplicationEnums';
import { HomeDataModal } from '../../Engine/Modals/HomeDataModal';
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
    tempLocations: Array<Array<string>>
}

export class OnBoardingPageViewModal extends React.Component<IProps, IState> {

    cachedDate: Date = new Date();
    Controller: OnBoardingPageController;
    cachedLastHomeDateObject: Date = new Date();

    constructor(props: IProps) {
        super(props)
        
        this.Controller = new OnBoardingPageController()
        this.state = {
            showPicker: false,
            validationInProgress: false,
            culprits: [0],
            homes: this.Controller.GetAllHomesData(),
            name: "",
            tempLocations: []
        }

        this.loadState();
    }
    
    loadState = async() => {
        await this.Controller.loadHomeData();
        this.setState({
            name: await this.Controller.GetName(),
            homes: this.Controller.GetAllHomesData()
        })
        await this.validateData()
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

        if(this.state.culprits.indexOf(1) == -1 && this.state.culprits.indexOf(2) == -1){
            return true;
        } else {
            await this.getTempLocations();
            return false;
        }
    }

    onLocationTextChange = async(pos: number, text: string) => {
        this.Controller.SetCursor(pos)
        await this.Controller.onLocationChangeText(pos, text)
        this.setState({
            homes: this.Controller.GetAllHomesData()
        })
    }

    onNextButtonClick = async() => {
        var validateSuccess = await this.validateData()
        if (validateSuccess) {
            await this.Controller.SetAllHomeData(this.state.homes)
            this.props.setPage(Page[Page.LOADING])
        }
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
        if(this.Controller.GetLastHomeData() != undefined)
            this.props.setPage(Page[Page.ASKFORDATE])
        else 
            this.props.setPage(Page[Page.ASKFORLOCATION])
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 200}}  style={{ flex: 1, marginTop: 5, padding: 20, flexGrow: 1}} contentInset={{ bottom: 500 + this.state.homes.length*50}} >
            <View style={{flex: 1}}>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.state.name}</Text>
                    <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Add your past home cities</Text>
                    <Text style={{ marginTop: 12, fontSize: 22, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>You could add later too ;)</Text>
                </View>
                <View style={{ flex: 1, height: '100%' }}>
                    
                        {
                            this.state.homes.map((home, i) => {
                                    var JSXRetVal = (
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
                                                {this.state.culprits[i] == 2 && this.state.tempLocations[i] != undefined? 
                                                    this.state.tempLocations[i].map((el, index) => {
                                                        console.log(el)
                                                        return (
                                                            <Text style={{ color: 'lightgrey'}} onPress={(e: any) => this.setLocation(i, el)}>{"\n " + (index+1) + ". " + el + "\n"}</Text>
                                                        )
                                                    }) : <View />}
                                                <Text style={{ color: 'white', fontSize: 20, marginBottom: 20, textAlign:'center'  }}>{home.timestamp == 0 ? "Long long ago" : this.Controller.GetCachedDateAsString(new Date(home.timestamp))} - {i == 0 ? "Now" : this.Controller.GetCachedDateAsString(this.cachedLastHomeDateObject)}</Text>
                                            </View>
                                            {i != 0 ?
                                            <TouchableOpacity onPress={async() => await this.onDeleteHome(i)}>
                                                <Icon name='closecircle' size={30} />
                                            </TouchableOpacity>
                                            : <View />}
                                        </View>
                                    )
                                    this.cachedLastHomeDateObject = new Date(home.timestamp)
                                    return JSXRetVal;
                                }
                            )
                        }
                        <Button title={"Add New"} onPress={this.onNewHome} />
                        
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                            <Text style={{ fontSize: 22 }}>Next</Text>
                        </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        )
    }
}