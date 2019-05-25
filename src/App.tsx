import * as React from 'react';
import { View, AsyncStorage, SafeAreaView } from 'react-native';
// import RNBackgroundService from 'react-native-background-service';
import {Page} from './Modals/ApplicationEnums';
import TripExplorePage from './Pages/TripExplorePage';
import LoadingPage from './Pages/LoadingPage';
import SocialPage from './Pages/SocialPage/SocialPage';
import ProfilePage from './Pages/ProfilePage';
import { TopNavigator } from './UIComponents/TopNavigator';
import { OnBoardingPage } from './Pages/OnBoardingPage';
import StepExplorePage from './Pages/StepExplorePage';

// RNBackgroundService.RNBackgroundServiceLocationListener.addListener('LocationListener',
// (res) => { console.log("Location: " + res) });


interface IState {
  page: string,
  pageDataPipe: {[key:string]: any}
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      // Change to Page.NONE
      page: Page[Page.ONBOARDING],
      pageDataPipe: {} 
    };
  }

  setPage(page: string, data: any) {
    this.state.pageDataPipe[page] = data;
    // AsyncStorage.setItem('lastPage', page);
    // console.log()
    // AsyncStorage.setItem('lastPageDataPipe', JSON.stringify(this.state.pageDataPipe));
    this.setState({
      page: page
    });
  }

  sliderChange(item: number) {
    console.log("Slider changed!! " + item);
    this.setState({
      page: Page[item]
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:'#454545' }} >
        <View style={{flexDirection: 'column', height: "100%"}}>
          <TopNavigator navigatorFunc={this.sliderChange.bind(this)}/>
          {
            this.state.page == Page[Page.LOADING] ?
              <LoadingPage onDone={(data) => this.setPage(Page[Page.PROFILE], data)} homes={this.state.pageDataPipe[Page[Page.LOADING]]}/>
            : this.state.page == Page[Page.PROFILE] ? 
              <ProfilePage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.PROFILE]]} />
            : this.state.page == Page[Page.TRIPEXPLORE] ? 
              <TripExplorePage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.PROFILE]]} />
            : this.state.page == Page[Page.ONBOARDING] ? 
              <OnBoardingPage onDone={(data) => this.setPage(Page[Page.LOADING], data)}/>
            : this.state.page == Page[Page.STEPEXPLORE] ?
              <StepExplorePage data={this.state.pageDataPipe[Page[Page.STEPEXPLORE]]}/>
            : <View />
          }
        </View>
      </SafeAreaView>
    )
  }
}