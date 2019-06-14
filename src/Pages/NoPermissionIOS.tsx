import * as React from 'react'
import { View, Text } from 'react-native';


interface IProps {
    setPage: any
}   

interface IState {

}


export class NoPermissionIOS extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <View style={{justifyContent: 'center', alignContent:'center', width: '100%', height:'100%'}}>
                <Text style={{alignSelf:'center', textAlign:'center', fontSize: 20, color:'white'}}> Glimpse can't work without permission to access the photo library </Text>
                <Text> </Text>
                <Text style={{alignSelf:'center', fontSize: 20, color:'white'}}> To give permission, go to </Text>
                <Text> </Text>
                <Text style={{fontWeight: 'bold', fontSize: 24, alignSelf: 'center', color:'white'}}> Settings -> Glimpse -> Photos</Text>
                <Text> </Text>
                <Text style={{alignSelf:'center', textAlign:'center', fontSize: 20, color:'white'}}> and restart Glimpse </Text>
            </View>
        )
    }
}