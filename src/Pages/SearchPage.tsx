import * as React from 'react'
import { View, Text } from 'react-native'

interface IProps {
    setPage: any
}

interface IState {

}


export class SearchPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <View style={{alignContent:'center', justifyContent:'center'}}>
                <Text>Lots of interesting and cool stuff is under development. Expect in another month :)</Text>
            </View>
        )
    }
}