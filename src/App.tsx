import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
// import RNBackgroundService from 'react-native-background-service';
import {Page} from './Modals/ApplicationEnums';
import MapPhotoPage from './Pages/MapPhotoPage';
import LoadingPage from './Pages/LoadingPage';
import SocialPage from './Pages/SocialPage/SocialPage';
import ProfilePage from './Pages/ProfilePage';
import { TopNavigator } from './UIComponents/TopNavigator';

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
      page: Page[Page.LOADING],
      pageDataPipe: {} 
    };

    /*
    AsyncStorage.getItem('lastPage')
      .then((item) => {
          if(item) {
            AsyncStorage.getItem('lastPageDataPipe')
              .then((item2) => {
                if(item2) {
                  this.setState({
                    page: item,
                    pageDataPipe: JSON.parse(item2)
                  });
                } else {
                  this.setState({
                    page: Page[Page.LOADING]
                  });
                }
              });
          } else {
            this.setState({
              page: Page[Page.LOADING]
            });
          }
      });
      */


    // RNBackgroundService.RNBackgroundServiceLocationService.requestPermission();
    // RNBackgroundService.RNBackgroundServiceLocationService.startLocationTracking();
  }

  setPage(page: string, data: any) {
    this.state.pageDataPipe[page] = data;
    AsyncStorage.setItem('lastPage', page);
    AsyncStorage.setItem('lastPageDataPipe', JSON.stringify(this.state.pageDataPipe));
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
      <View style={{flexDirection: 'column', height: "100%"}}>
        <TopNavigator navigatorFunc={this.sliderChange.bind(this)}/>
        {
          this.state.page == Page[Page.LOADING] ?
            <LoadingPage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.LOADING]]}/>
          : this.state.page == Page[Page.PROFILE] ? 
            <ProfilePage />
          : this.state.page == Page[Page.MAPVIEW] ? 
            <MapPhotoPage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.MAPVIEW]]} />
          : <View />
        }
      </View>
    )
  }
}