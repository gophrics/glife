import * as React from 'react';
import { View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { Page } from '../Modals/ApplicationEnums';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { SettingsModal } from '../Modals/SettingsModal';

interface IProps {
    setPage: any
}

interface IState {

}

export class SettingsPage extends React.Component<IProps, IState> {

    myData: SettingsModal;
    constructor(props: IProps) {
        super(props)
        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.SETTING])
        if(this.myData == null) this.myData = new SettingsModal();
    }

    render() {
        return (
            <View>
            <LoginButton
                    publishPermissions={["email"]}
                    onLoginFinished={
                        (error: any, result: any) => {
                        if (error) {
                            alert("Login failed with error: " + error.message);
                        } else if (result.isCancelled) {
                            alert("Login was cancelled");
                        } else {
                            this.myData.fbLoggedIn = true
                            this.props.setPage(Page[Page.SETTING], this.myData)
                            alert("Login was successful with permissions: " + result.grantedPermissions)
                        }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")}/>
                
            </View>
        )
    }
}