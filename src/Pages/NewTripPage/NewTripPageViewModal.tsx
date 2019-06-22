import * as React from 'react'
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { Page } from '../../Modals/ApplicationEnums';
import { NewTripPageController } from './NewTripPageController';

interface IProps {
    setPage: any
}

interface IState {
    showPicker: boolean
    tripName: string
    valid: boolean
}

export class NewTripPage extends React.Component<IProps, IState> {
    calenderCursor: number = 0;
    from: Date = new Date();
    tripTitle: string = "";
    myData: any

    Controller: NewTripPageController
    constructor(props: IProps) {
        super(props)
        this.state = {
            showPicker: false,
            tripName: "",
            valid: true
        }

        this.Controller = new NewTripPageController()

        this.Controller.checkPermissionToAccessPhotoLibrary()
        .then((res: boolean) => {
                if(!res) this.props.setPage(Page[Page.NOPERMISSIONIOS])
            }
        )
    }

    onTitleChange = (title: string) => {
        this.setState({
            tripName: title
        })
        this.Controller.setTripTitle(title)
        this.validate()
    }

    validate = () => {
        this.setState({
            valid: this.Controller.validateInputs()
        })
    }

    onNextClick = () => {
        if(this.Controller.processNewTrip()) {
            this.props.setPage(Page[Page.PROFILE])
        } else {
            this.setState({
                valid: false
            })
        }
    }

    render() {

        return (
            <View>
                <Text style={{ marginTop: 20, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Enter the trip name. Add the steps later.</Text>
                <View style={{justifyContent:'center', height: '60%', padding: 20}}>
                    <TextInput placeholder="Enter trip name" style={{ textAlign:'center', fontSize: 20, color:'white', padding: 5, alignSelf:'center', borderWidth: !this.state.valid ? 1 : 0, borderColor: 'red', borderRadius: 5}} onChangeText={(text) => this.onTitleChange(text)} />
                </View>

                <View style={{justifyContent:'center', width:'20%', alignSelf:'center', alignContent:'center', backgroundColor:'white', margin:10, borderRadius: 5, padding: 10}}>
                    <TouchableOpacity onPress={this.onNextClick.bind(this)}>
                        <Text style={{fontSize:22, textAlign:'center'}}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}