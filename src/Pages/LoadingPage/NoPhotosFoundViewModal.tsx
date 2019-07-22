import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { Page } from '../../Modals/ApplicationEnums';


interface IProps {
    setPage: any
}

interface IState {

}


export class NoPhotosFoundViewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onContinuePress = () => {
        this.props.setPage(Page[Page.PROFILE])
    }

    render(){
        return (
            <View style={{alignContent:'center', justifyContent:'center', height: '100%', width:'100%', padding: 10 }}>
                <Text style={{fontSize: 22, color:'white', alignSelf:'center', textAlign:'center', paddingBottom: 100}}>No photos were found with location tags, have you enabled location tagging in your camera?</Text>
                <Button title={"Continue"} onPress={this.onContinuePress}></Button>
            </View>
        )
    }
}