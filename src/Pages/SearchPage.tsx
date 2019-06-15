import * as React from 'react'
import { View, Text } from 'react-native'
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import { SettingsModal } from '../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {

}


export class SearchPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        if(!(BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING]) as SettingsModal).loggedIn)
            this.props.setPage(Page[Page.REGISTER])
    }

    render() {
        return (
            <View style={{alignContent:'center', justifyContent:'center'}}>
                <Text>Lots of interesting and cool stuff is under development. Expect in another month :)</Text>
            </View>
        )
    }
}