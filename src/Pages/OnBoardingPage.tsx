import * as React from 'react'
import { Image, View, TextInput, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page, HomeDataModal } from '../Modals/ApplicationEnums';
import { TripUtils } from '../Utilities/TripUtils';
import Icon from 'react-native-vector-icons/AntDesign';

interface IProps {
    navigatorVisible: boolean
    onDone: (page: string, data: any) => void
}

interface IState {
    numberOfHomes: number,
    showPicker: boolean,
    dates: any
    valid: boolean
    validationInProgress: boolean
    culprits: Array<number>,
    homes: HomeDataModal[]
}

const deviceHeight = Dimensions.get('screen').height;

export class OnBoardingPage extends React.Component<IProps, IState> {

    cursor: number = 0
    name: string = "";
    tempLocations: any[][] = [];
    cachedDate: Date = new Date();
    
    constructor(props: IProps) {
        super(props)
        this.state = {
            numberOfHomes: 1,
            showPicker: false,
            dates: ["Long long ago.."],
            valid: true,
            validationInProgress: false,
            culprits: [0],
            homes: [{ name: "", timestamp: 0 }]
        }
        this.name = BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name
    }

    onLocationPress = (e: any) => {
        this.validateData()
    }

    findExactName(obj: any, name: string) {
        for (var key of obj) {
            if ((key.name + ", " + key.country).trim() == name.trim()) {
                return true;
            }
        }

        return false;
    }

    removeDuplicates = (obj: any) => {
        var result: { name: string, country: string }[] = []
        for (var key of obj) {
            var t = key.display_name.split(', ')
            if (!this.findExactName(result, t[0] + ", " + t[t.length - 1]))
                result.push({
                    name: t[0],
                    country: t[t.length - 1]
                })
        }
        return result
    }

    validateData = async () => {
        this.setState({
            validationInProgress: true
        })
        var count = 0, asyncCount = 0;
        // Deep copy
        var culprits = this.state.culprits.slice();

        for (var i = 0; i < culprits.length; i++) culprits[i] = 1;

        this.tempLocations = []
        for (var home of this.state.homes) {
            if(home.name == "") {
                culprits[count] = 1;
                count++; continue;
            }
            var res = await TripUtils.getCoordinatesFromLocation(home.name)
            res = this.removeDuplicates(res)
            var j = 1;
            this.tempLocations.push([])
            for (var obj of res) {
                this.tempLocations[count].push(obj);//<Text style={{ color: 'lightgrey' }} >{"\n " + j + ". " + obj.name.trim() + ", " + obj.country.trim() + "\n"}</Text>)
                j++;
            }
            if (res && res.length == 1 || (this.findExactName(res, home.name))) { asyncCount++; culprits[count] = 0 }
            else if (res) culprits[count] = 2
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
        this.cachedDate = dateObject;
        this.validateData();
        if (this.state.homes.length <= this.cursor + 1) this.state.homes.push({ name: "", timestamp: 0 })

        var dates = this.state.dates;
        dates[this.cursor] = dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear()
        this.state.homes[this.cursor].timestamp = dateObject.getTime();
        this.state.culprits.push(0)
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
        if (this.state.homes.length <= this.cursor) this.state.homes.push({ name: "", timestamp: NaN })
        this.state.homes[pos].name = text
    }

    onNextButtonClick = () => {
        this.validateData()
            .then((res) => {
                if (res) {
                    this.setState({
                        valid: true
                    })
                    this.props.onDone(Page[Page.LOADING], this.state.homes)
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
        var dates = []
        for (var i = 0; i < this.state.homes.length; i++) {
            if (i != pos) {
                if (i == pos - 1) {
                    homes.push({ name: this.state.homes[i].name, timestamp: this.state.homes[pos].timestamp == 0 ? NaN : this.state.homes[pos].timestamp })
                    dates.push(this.state.dates[pos])
                } else {
                    homes.push(this.state.homes[i])
                    dates.push(this.state.dates[i])
                }
            }
        }
        this.setState({
            homes: homes,
            dates: dates
        })
    }

    onNewHome = () => {
        this.state.homes.push({name: "", timestamp: NaN})
    }

    setLocation = (index: number, obj: any) => {

        var homes = this.state.homes;

        homes[index].name = obj.name.trim() + ", " + obj.country.trim()
        this.setState({
            homes: homes
        })
        this.validateData()
    }

    render() {

        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi {this.name}</Text>
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
                                        {this.state.culprits[i] == 2 && this.tempLocations[i] != undefined? 
                                            this.tempLocations[i].map((el, index) => (
                                                <Text style={{ color: 'lightgrey'}} onPress={(e: any) => this.setLocation(i, el)}>{"\n " + (index+1) + ". " + el.name.trim() + ", " + el.country.trim() + "\n"}</Text>
                                            )) : <View />}
                                        <Text style={{ color: 'white', fontSize: 20, marginBottom: 20, textAlign:'center'  }}>{this.state.dates[i] ? this.state.dates[i] : "Long long ago.."} - {this.state.dates[i-1] ? this.state.dates[i-1] : "Current"}</Text>
                                    </View>
                                    {i != 0 ?
                                    <TouchableOpacity onPress={() => this.onCancelClick(i)}>
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
                    onConfirm={this.onPickerConfirm.bind(this)}
                    onCancel={this.onPickerCancel.bind(this)}
                />
            </View>
        )
    }
}