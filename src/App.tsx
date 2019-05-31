import * as React from 'react';
import {
  View,
  SafeAreaView,
  DatePickerIOS,
} from 'react-native'
import {Page} from './Modals/ApplicationEnums';
import TripExplorePage from './Pages/TripExplorePage';
import LoadingPage from './Pages/LoadingPage';
import ProfilePage from './Pages/ProfilePage';
import { TopNavigator } from './UIComponents/TopNavigator';
import { OnBoardingPage } from './Pages/OnBoardingPage';
import StepExplorePage from './Pages/StepExplorePage';
import { SplashScreen } from './Pages/SplashScreen';
import { NewTripPage } from './Pages/NewTripPage';
import { BlobSaveAndLoad } from './Utilities/BlobSaveAndLoad';
import AsyncStorage from '@react-native-community/async-storage';

interface IState {
  page: string,
  navigatorVisible: boolean
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      // Change to Page.NONE
      page: Page[Page.SPLASHSCREEN],
      navigatorVisible: true
    };
    // Uncomment for development
    AsyncStorage.clear()
    
    BlobSaveAndLoad.Instance.loadBlob()
    .then((res) => {
      this.setState({
        page: res == null ? Page[Page.ONBOARDING] : Page[Page.PROFILE]
      })
    })

  }

  setPage(page: string, data: any) {
    if(data != null) 
      BlobSaveAndLoad.Instance.setBlobValue(page, data);
    BlobSaveAndLoad.Instance.saveBlob();
    // AsyncStorage.setItem('lastPage', page);
    // console.log()
    // AsyncStorage.setItem('lastPageDataPipe', JSON.stringify(this.state.pageDataPipe));
    this.setState({
      page: page
    });
  }

  sliderChange(item: string) {
    console.log("Slider changed!! " + item);
    this.setState({
      page: item
    })
  }

  setNavigator = (value: boolean) => {
    this.setState({
      navigatorVisible: value
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:'#00DC13' }} >
        <View style={{flexDirection: 'column', height: "100%"}}>
        {this.state.navigatorVisible ? 
          <View style={{height: 60, backgroundColor: '#00000000'}}>
              <TopNavigator visible={this.state.navigatorVisible} navigatorFunc={this.sliderChange.bind(this)}/> 
          </View>
        : <View />}
          {
            this.state.page == Page[Page.LOADING] ?
              <LoadingPage setNavigator={this.setNavigator} onDone={(data) => this.setPage(Page[Page.PROFILE], data)} />
            : this.state.page == Page[Page.PROFILE] ? 
              <ProfilePage setNavigator={this.setNavigator} setPage={this.setPage.bind(this)} />
            : this.state.page == Page[Page.TRIPEXPLORE] ? 
              <TripExplorePage setPage={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.ONBOARDING] ? 
              <OnBoardingPage onDone={this.setPage.bind(this)}/>
            : this.state.page == Page[Page.STEPEXPLORE] ?
              <StepExplorePage setPage={this.setPage.bind(this)} setNavigator={this.setNavigator}/>
            : this.state.page == Page[Page.SPLASHSCREEN] ? 
              <SplashScreen setNavigator={this.setNavigator} />
            : this.state.page == Page[Page.NEWTRIP] ? 
              <NewTripPage setPage={this.setPage.bind(this)}/>
            : <View />
          }
        </View>
      </SafeAreaView>
    )
  }
}