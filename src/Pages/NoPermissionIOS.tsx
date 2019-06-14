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
            <View style={{justifyContent: 'center', alignContent:'center'}}>
                <Text style={{alignSelf:'center'}}> The app can't work without permission to access the photo library </Text>
                <Text style={{alignSelf:'center'}}> To give permission, go to </Text>
                <Text style={{fontWeight: 'bold', alignSelf: 'center'}}> Settings -> Glimpse -> Photos</Text>
            </View>
        )
    }
}