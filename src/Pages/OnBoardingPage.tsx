import * as React from 'react'
import { Image, View, TextInput, Button, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import { TravelUtils } from '../Utilities/TravelUtils';

interface IProps {
    onDone: (page: string, data: any) => void
}

interface IState {
    numberOfHomes: number,
    showPicker: boolean,
    dates: any
    valid: boolean
    validationInProgress: boolean
    culprits: Array<boolean>
}

export class OnBoardingPage extends React.Component<IProps, IState> {

    homes: { name: string, timestamp: number }[] = [];
    cursor: number = 0
    name: string = "";

    constructor(props: IProps) {
        super(props)
        this.state = {
            numberOfHomes: 1,
            showPicker: false,
            dates: {},
            valid: true,
            validationInProgress: false,
            culprits: [true]
        }
        this.name = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name
    }

    validateData = async() => {
        this.setState({
            validationInProgress: true
        })
        var count = 0, asyncCount = 0;

        var culprits = this.state.culprits;
        for(var i = 0; i < culprits.length; i++) culprits[i] = false;
        for(var home of this.homes) {
            var res = await TravelUtils.getCoordinatesFromLocation(home.name)
            if(res && res.length > 0) { asyncCount++;  culprits[count] = true } 
            count++
        }
        
        this.setState({
            validationInProgress: false,
            culprits: culprits
        })
        return count == asyncCount && count != 0;
    }


    onButtonClick = () => {
        this.setState({
            numberOfHomes: this.state.numberOfHomes + 1
        })
        this.cursor++;
    }

    onPickerConfirm = (date: string) => {
        if (this.homes.length <= this.cursor) this.homes.push({ name: "", timestamp: 0 })

        var dates = this.state.dates;
        var dateObject: Date = new Date(date)
        dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
        this.homes[this.cursor].timestamp = dateObject.getTime();
        this.state.culprits.push(true)
        this.setState({
            showPicker: false,
            dates: dates
        })
        this.onButtonClick();
    }

    onPickerCancel = () => {
        this.setState({
            showPicker: false
        })
    }

    onCalenderClick = (pos: number) => {
        this.setState({
            showPicker: true
        })
        this.cursor = pos
    }

    onLocationTextChange = (pos: number, text: string) => {
        this.cursor = pos
        if (this.homes.length <= this.cursor) this.homes.push({ name: "", timestamp: NaN })
        this.homes[pos].name = text
    }

    onNextButtonClick = () => {
        this.validateData()
        .then((res) => {
            if (res) {
                this.setState({
                    valid: true
                })
                this.props.onDone(Page[Page.LOADING], this.homes)
            }
            else {
                this.setState({
                    valid: false
                })
            }
        })
    }

    render() {
        if (this.state == null) return (<View />)

        var inputs = []
        for (var i = 0; i < this.state.numberOfHomes; i++) {
            inputs.push(
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', width: '90%' }}>
                        <TextInput
                            key={i}
                            placeholder={"Your " + (i + 1) + ((i == 0) ? "st" : (i == 1) ? "nd" : "th") + " home city"}
                            onChangeText={(text) => this.onLocationTextChange(i - 1, text)}
                            style={[{ fontSize: 22, padding: 3, color: 'white' }, {borderWidth: ((this.state.culprits[i] == false) ? 1: 0), borderColor: ((this.state.culprits[i] == false) ? 'red': 'white')}]}
                            textContentType={'addressCity'}
                        />
                        <Text style={{ color: 'white', marginBottom: 20 }}>{i == 0 ? "Beginning of time" : this.state.dates[i - 1]} - {this.state.dates[i] ? this.state.dates[i] : "Current"}</Text>
                    </View>
                    <TouchableOpacity key={i} onPress={() => this.onCalenderClick(i - 1)}>
                        <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../Assets/icons8-calendar-52.png')} />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.name}</Text>
                    <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Tell us your home cities, for the magic to happen</Text>
                </View>
                <View style={{height: '100%'}}>
                    <View style={{ marginTop: 5, padding: 20 }} >
                        {inputs}
                    </View>
                </View>
                <TouchableOpacity style={{position:'absolute', bottom: 300, right: 20, alignSelf:'center', backgroundColor: 'white', borderRadius: 10, padding: 10}} onPress={this.onNextButtonClick}>
                    <Text style={{fontSize: 22}}>Next</Text>    
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={this.state.showPicker}
                    onConfirm={this.onPickerConfirm.bind(this)}
                    onCancel={this.onPickerCancel.bind(this)}
                />
            </View>
        )
    }
}