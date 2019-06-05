import * as React from 'react'
import { Image, View, TextInput, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import { TravelUtils } from '../Utilities/TravelUtils';
import Icon from 'react-native-vector-icons/AntDesign';

interface IProps {
    onDone: (page: string, data: any) => void
}

interface IState {
    numberOfHomes: number,
    showPicker: boolean,
    dates: any
    valid: boolean
    validationInProgress: boolean
    culprits: Array<number>
}

export class OnBoardingPage extends React.Component<IProps, IState> {

    homes: { name: string, timestamp: number }[] = [{name: "", timestamp: 0}];
    cursor: number = 0
    name: string = "";
    tempLocations: JSX.Element[] = [];

    constructor(props: IProps) {
        super(props)
        this.state = {
            numberOfHomes: 1,
            showPicker: false,
            dates: {},
            valid: true,
            validationInProgress: false,
            culprits: [0]
        }
        this.name = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name
    }

    onLocationPress = (e: any) => {
        this.validateData()
    }

    findExactName(obj: any, name: string) {
        for(var key of obj) {
            if((key.name + ", " + key.country).trim() == name.trim()) {
                return true;
            }
        }
           
        return false;
    }

    removeDuplicates = (obj: any) => {
        var result: {name: string, country: string}[] = []
        for(var key of obj) {
            var t = key.display_name.split(', ')
            if(!this.findExactName(result, t[0] + ", " + t[t.length-1]))
            result.push({
                name: t[0],
                country: t[t.length-1]
            })
        }
        return result
    }

    validateData = async() => {
        this.setState({
            validationInProgress: true
        })
        var count = 0, asyncCount = 0;
        // Deep copy
        var culprits = this.state.culprits.slice();

        for(var i = 0; i < culprits.length; i++) culprits[i] = 1;
        for(var home of this.homes) {
            var res = await TravelUtils.getCoordinatesFromLocation(home.name)
            res = this.removeDuplicates(res)
            var j = 1;
            this.tempLocations = []
            for(var obj of res) {
                this.tempLocations.push(<Text style={{color:'lightgrey'}} >{"\n " + j + ". " + obj.name.trim() + ", " + obj.country.trim() + "\n"}</Text>)
                j++;
            }
            if(res && res.length == 1 || (this.findExactName(res, home.name))) { asyncCount++;  culprits[count] = 0 } 
            else if(res) culprits[count] = 2
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

    onPickerConfirm = (dateObject: Date) => {
        this.validateData().then((res) => {
            if(!res){
                this.setState({
                    showPicker: false,
                });
                return;
            }

            if (this.homes.length <= this.cursor + 1) this.homes.push({ name: "", timestamp: 0 })

            var dates = this.state.dates;
            dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
            this.homes[this.cursor].timestamp = dateObject.getTime();
            this.state.culprits.push(0)
            this.setState({
                showPicker: false,
                dates: dates
            })
            this.onButtonClick();
        })
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
        console.log(this.homes)
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

    shiftCursor = (pos: number) => {
        this.cursor = pos;
    }

    onCancelClick = (pos: number) => {
        var homes = []
        for(var i = 0; i < this.homes.length; i++) 
            if(i != pos) homes.push(this.homes[i])
        this.homes = homes
        this.render();
    }

    render() {

        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.name}</Text>
                    <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Tell us your home cities, for the magic to happen</Text>
                </View>
                <View style={{height: '100%'}}>
                    <ScrollView style={{ marginTop: 5, padding: 20 }} contentInset={{top: 0, bottom: 500}} >
                        {
                            this.homes.map((el, i) => (
<View key={i + 'a'} style={{ flexDirection: 'row' }} onTouchStart={(e) => this.shiftCursor(i)} >
                    <View style={{ flexDirection: 'column', width: '90%' }}>
                        <TextInput
                            onEndEditing={this.validateData}
                            placeholder={"Your " + (i + 1) + ((i == 0) ? "st" : (i == 1) ? "nd" : "th") + " home city"}
                            onChangeText={(text) => this.onLocationTextChange(i, text)}
                            style={[{ fontSize: 22, padding: 3, color: 'white' }, {borderWidth: ((this.state.culprits[i] != 0) ? 1: 0), borderColor: ((this.state.culprits[i] != 0) ? 'red': 'white')}]}
                            textContentType={'addressCity'}
                        />
                        {this.state.culprits[i] != 0 ? <Text style={{color:'red', padding: 3}} > {this.state.culprits[i] == 1 ? "Try nearest city, the digital overloard can't find this place in the map" : "Be more specific, multiple places with same name exist. Try Bangalore, India" } </Text> : <View />}
                        {this.state.culprits[i] == 2 ? <Text style={{color:'lightgrey', padding: 3}}>Places found: </Text> : <View />}
                        {this.state.culprits[i] == 2 ? this.tempLocations: <View /> }
                        <Text style={{ color: 'white', marginBottom: 20 }}>{i == 0 ? "Beginning of time" : this.state.dates[i - 1]} - {this.state.dates[i] ? this.state.dates[i] : "Current"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.onCalenderClick(i)}>
                        <Image style={{ width: 30, height: 30, padding: 2 }} source={require('../Assets/icons8-calendar-52.png')} />
                    </TouchableOpacity>
                    {i != 0 ? 
                    <TouchableOpacity onPress={() => this.onCancelClick(i)}>
                        <Icon name='cross' size={30} />
                    </TouchableOpacity>
                    : <View />}
                </View>
                            ))
                        }
                    </ScrollView>
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