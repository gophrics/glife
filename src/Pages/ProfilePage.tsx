import * as React from 'react';
import { View } from 'react-native';
import { ProfileComponent } from '../UIComponents/ProfileComponent';

interface IState {

}

interface IProps {

}

export default class ProfilePage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    render() {

        return (
            <View>
                <ProfileComponent />
            </View>
        )
    }
}