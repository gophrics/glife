import * as React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import { OnBoardingPageController } from './OnBoardingPageController';
import { Page } from '../../Modals/ApplicationEnums';

interface IProps {
    setPage: any
}

interface IState {
    lastHome: string
    showPicker: boolean
    cachedDate: Date
    cachedDateAsString: string
}

export class AskForLocationChangeDatePage extends React.Component<IProps, IState> {

    Controller: OnBoardingPageController;

    constructor(props: IProps) {
        super(props)
        this.state = {
            showPicker: false,
            lastHome: "",
            cachedDate: new Date(),
            cachedDateAsString: ""
        }
        
        this.Controller = new OnBoardingPageController()
        this.loadState()
    }

    loadState = async() => {
        await this.Controller.loadHomeData()
        var _lastHome = this.Controller.GetLastHomeData()
        var lastHome = _lastHome == undefined ? "" : _lastHome.name 
        this.setState({
            lastHome: lastHome,
            cachedDate: this.Controller.GetCachedDate(),
            cachedDateAsString: await this.Controller.GetCachedDateAsString(this.Controller.GetCachedDate())
        })
    }

    onCalenderPress = (ev: any) => {
        this.setState({
            showPicker: true
        })
    }

    onCalenderConfirm = async(date: Date) => {
        this.Controller.SetCachedDate(date)
        this.setState({
            cachedDate: date,
            cachedDateAsString: await this.Controller.GetCachedDateAsString(date),
            showPicker: false
        })
    }

    onCalenderCancel = () => {
        this.setState({
            showPicker: false
        })
    }

    onNextButtonClick = async() => {
        await this.Controller.SaveData()
        this.props.setPage(Page[Page.ASKFORLOCATION])
    }

    render() {
        return (
            <View>
                {
                    <View>
                        <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>When did you move to {this.state.lastHome}?</Text>
                        <Text style={{ marginTop: 50, fontSize: 22, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>{this.state.cachedDateAsString}</Text>
                        <Button title={"Pick date"} onPress={this.onCalenderPress}/>
                    </View>
                }

                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10 }} onPress={this.onNextButtonClick}>
                    <Text style={{ fontSize: 22 }}>Next</Text>
                </TouchableOpacity>
                <DateTimePicker
                    date={this.state.cachedDate}
                    isVisible={this.state.showPicker}
                    onConfirm={this.onCalenderConfirm.bind(this)}
                    onCancel={this.onCalenderCancel.bind(this)}
                />
            </View>
        )
    }
}