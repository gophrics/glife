import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { BlobSaveAndLoad } from '../Engine/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';


interface IProps {
    setPage: any
    navigatorVisible: boolean
}

interface IState {
    valid: boolean
}

const deviceHeight = Dimensions.get('window').height

export class PreOnBoardingPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            valid: true
        }
    }

    validate = () => {
        this.setState({
            valid: BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]] != undefined && 
            BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name != undefined &&
            (BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name as string).trim().length > 0
        })
        return BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]] != undefined && 
            BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name != undefined
    }

    onNameTextChange = (text: string) => {
        if(!BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]])
            BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]] = {}
        BlobSaveAndLoad.Instance.pageDataPipe[Page[Page.PROFILE]].name = text
        this.validate()
    }

    onNextButtonClick = () => {
        if(this.validate())
            this.props.setPage(Page[Page.ONBOARDING])
    }

    render() {
        return (
            <View>
                <View>
                    <Text style={{ marginTop: 50, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>Hi.</Text>
                    <Text style={{ marginTop: 10, fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'AppleSDGothicNeo-Regular', padding: 20 }}>What's your name?</Text>
                </View>

                <View style={{ height: '100%', padding: 20 }}>
                    <TextInput
                        placeholder={"Enter name"}
                        onChangeText={(text) => this.onNameTextChange(text)}
                        style={[{ alignSelf:"center", textAlign:'center', fontSize: 22, padding: 3, color: 'white'}, { borderWidth: this.state.valid ? 0 : 1, borderColor: this.state.valid ? "" : "darkred" }]}
                        textContentType={'givenName'}
                    />
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 100, backgroundColor: 'white', borderRadius: 10, padding: 10  }} onPress={this.onNextButtonClick}>
                        <Text style={{ fontSize: 22 }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}