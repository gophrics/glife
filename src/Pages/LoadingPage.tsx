import * as React from 'react';
import { Text,Platform, View, StyleSheet, ViewStyle, TextStyle, PermissionsAndroid, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import Spinner from '../UIComponents/Spinner';
import * as PhotoLibraryProcessor from '../Utilities/PhotoLibraryProcessor';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import { TripUtils } from '../Utilities/TripUtils';
import { BlobSaveAndLoad } from '../Utilities/BlobSaveAndLoad';
import { Page } from '../Modals/ApplicationEnums';
import { ImageDataModal } from '../Modals/ImageDataModal';

interface Styles {
    spinnerContainer: ViewStyle,
    infoText: TextStyle
};

var styles = StyleSheet.create<Styles>({
    spinnerContainer: {
        flex: 5,
        alignSelf: 'center'
    },
    infoText: {
        flex: 9,
        fontFamily: 'AppleSDGothicNeo-Regular',
        fontSize: 28,
        textAlign: 'center',
        padding: '20%',
        alignSelf: 'center',
        color:'white'
    }
});

interface IProps {
    setNavigator: any,
    setPage: any
}

interface IState {
    finished: number,
    total: number
}



export default class LoadingPage extends React.Component<IProps, IState> {

    dataToSendToNextPage: MapPhotoPageModal = new MapPhotoPageModal([]);
    myData: any
    retryCount = 20;

    constructor(props:any) {
        super(props);

        this.props.setNavigator(false)

        this.myData = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.LOADING])
        var data: MapPhotoPageModal = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.PROFILE])
        data.trips = []
        data.countriesVisited = [];
        data.percentageWorldTravelled = 0;
        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.PROFILE], data)
        this.state = {
            finished: 0,
            total: 100
        }

        this.initialize();
    }

    requestPermissionAndroid = async() : Promise<boolean> => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Cool Photo App Camera Permission',
                message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use read from the storage")
                return true;
            } else {
              console.log("Storage permission denied")
              return false
            }
          } catch (err) {
            console.warn(err)
            return false
          }
    }

    // Helper methods
    initialize  = async() => {

        if(Platform.OS == "android") await this.requestPermissionAndroid()
        else if(Platform.OS == "ios") await PhotoLibraryProcessor.checkPhotoPermission()
        
        if(!(await PhotoLibraryProcessor.checkPhotoPermission())) {
            this.props.setPage(Page[Page.NOPERMISSIONIOS])
            return;
        }
        
        var photoRollInfos: ImageDataModal[] = await PhotoLibraryProcessor.getPhotosFromLibrary();

        // Create a No photos found warning page
        if(photoRollInfos.length == 0) {
            this.props.setPage(Page[Page.PROFILE])
        }

        await TripUtils.GenerateHomeData(this.myData)

        try {
            this.dataToSendToNextPage.trips = await TripUtils.GenerateTripFromPhotos(photoRollInfos)
        } catch (error) {
            this.props.setPage(Page[Page.PROFILE])
            return;
        }
    }

    render() {

        return (
            <View style={{width: '100%', justifyContent:'center', flex: 1}}>
                <Text style={styles.infoText}>Going through your photo library</Text>
                <Text style={{fontSize: 16, textAlign:'center', padding: 20, color:"white"}}>Make sure you don't close the app, and phone doesn't get locked</Text>
                <View style={{width: "60%", alignSelf: 'center'}}>
                {
                    Platform.OS == 'ios' ? 
                        <ProgressViewIOS progressViewStyle={'bar'} progress={this.state.finished/this.state.total}/>
                    : 
                        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={this.state.finished/this.state.total}/>
                }
                </View>
                <View style={styles.spinnerContainer}>	
                    <Spinner/>	
                </View>
            </View>
        );
    }

}