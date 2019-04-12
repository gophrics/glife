import * as React from 'react';
import { Image, View, ViewStyle, ImageStyle } from 'react-native';


interface IProps {
}

export default class Loading extends React.Component<IProps, any> {
    
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return(
            <View >
                <Image source={require('../Assets/Loading.gif')} />
            </View>
        )
    }
}