import * as React from 'react'
import { Image, View, TextInput, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { HomeDataModal } from '../../Modals/ApplicationEnums';
import Icon from 'react-native-vector-icons/AntDesign';
import { OnBoardingPageController } from './OnBoardingPageController';

interface IProps {
    navigatorVisible: boolean
    onDone: (page: string, data: any) => void
}

interface IState {
    showPicker: boolean,
    dates: Array<string>
    validationInProgress: boolean
    culprits: Array<number>,
    homes: Array<HomeDataModal>
}

const deviceHeight = Dimensions.get('screen').height;

export class OnBoardingPage extends React.Component<IProps, IState> {

    cachedDate: Date = new Date();
    Controller: OnBoardingPageController;

    constructor(props: IProps) {
        super(props)
        this.state = {
            showPicker: false,
            dates: ["Long long ago.."],
            validationInProgress: false,
            culprits: [0],
            homes: [{ name: "", timestamp: 0 }]
        }
        
        this.Controller = new OnBoardingPageController()
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

    onCalenderClick = (pos: number) => {
        this.setState({
            showPicker: true
        })
        this.Controller.SetCursor(pos)
    }

    onCalenderConfirm = async(dateObject: Date) => {
        this.cachedDate = dateObject;
        
        if(await this.validateData()) { 
            this.Controller.onCalenderConfirm(dateObject)
            this.setState({
                showPicker: false,
                dates: this.Controller.dates
            })
            this.Controller.incrementCursor();
        }
    }

    onCalenderCancel = () => {
        this.setState({
            showPicker: false
        })
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
                    this.Controller.SetAllHomeData(this.state.homes)
                }
            })
    }

    onDeleteHome = (pos: number) => {
        this.Controller.onDeleteHome(pos)

        this.setState({
            homes: this.Controller.GetAllHomesData(),
            dates: this.Controller.GetAllDates()
        })
    }

    setLocation = (index: number, obj: any) => {
        this.Controller.SetHomeName(index, obj.name.trim() + ", " + obj.country.trim())
        
        this.setState({
            homes: this.Controller.GetAllHomesData()
        })

        this.validateData()
    }

    render() {

        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.Controller.GetName()}</Text>
                    <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Tell us your home cities, for the magic to happen</Text>
                </View>
                <View style={{ height: '100%' }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}  style={{ marginTop: 5, padding: 20, flexGrow: 1}} contentInset={{ bottom: 500 + this.state.homes.length*50}} >
                        {
                            this.state.homes.map((el, i) => (
                                <View key={i + 'a'} style={{ flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.onCalenderClick(i)}>
                                        <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../../Assets/icons8-calendar-52.png')} />
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'column', width:'90%', alignSelf:'center'}}>
                                        <TextInput
                                            editable={true}
                                            onEndEditing={this.validateData}
                                            placeholder={(i == 0) ? "Your most recent home city" : "Your previous home city"}
                                            onChangeText={(text) => this.onLocationTextChange(i, text)}
                                            style={[{ fontSize: 22, padding: 3, color: 'white', textAlign: 'center' }, { borderWidth: ((this.state.culprits[i] != 0) ? 1 : 0), borderColor: ((this.state.culprits[i] != 0) ? 'red' : 'white') }]}
                                            textContentType={'addressCity'}
                                        >{el.name}</TextInput>
                                        {this.state.culprits[i] != 0 ? <Text style={{ color: 'red', padding: 3 }} > {this.state.culprits[i] == 1 ? "Try nearest city, the digital overlords can't find this place in the map" : "Be more specific, multiple places with same name exist. Try Bangalore, India"} </Text> : <View />}
                                        {this.state.culprits[i] == 2 ? <Text style={{ color: 'lightgrey', padding: 3 }}>Places found: </Text> : <View />}
                                        {this.state.culprits[i] == 2 && this.getTempLocations()[i] != undefined? 
                                            this.getTempLocations()[i].map((el, index) => (
                                                <Text style={{ color: 'lightgrey'}} onPress={(e: any) => this.setLocation(i, el)}>{"\n " + (index+1) + ". " + el.name.trim() + ", " + el.country.trim() + "\n"}</Text>
                                            )) : <View />}
                                        <Text style={{ color: 'white', fontSize: 20, marginBottom: 20, textAlign:'center'  }}>{el.timestamp == 0 ? "Long long ago" : this.Controller.GetDateAsString(el.timestamp)} - {i == 0 ? "Current" : this.Controller.GetHomeData(i-1)}</Text>
                                    </View>
                                    {i != 0 ?
                                    <TouchableOpacity onPress={() => this.onDeleteHome(i)}>
                                        <Icon name='closecircle' size={30} />
                                    </TouchableOpacity>
                                    : <View />}
                                </View>
                            ))
                        }
                        <Text style={{alignSelf:'center'}}>To add previous home cities, select the calender date when you started living in the above city</Text>
                        
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                            <Text style={{ fontSize: 22 }}>Next</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <DateTimePicker
                    date={this.cachedDate}
                    isVisible={this.state.showPicker}
                    onConfirm={this.onCalenderConfirm.bind(this)}
                    onCancel={this.onCalenderCancel.bind(this)}
                />
            </View>
        )
    }
}