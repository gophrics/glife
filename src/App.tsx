import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
import RNBackgroundService from 'react-native-background-service';
import {Page} from './Modals/ApplicationEnums';
import MapPhotoPage from './Pages/MapPhotoPage';
import ParsingPhotoPage from './Pages/ParsingPhotoPage';


RNBackgroundService.RNBackgroundServiceLocationListener.addListener('LocationListener',
(res) => { console.log("Location: " + res) });


interface IState {
  page: Page
}

interface IProps {

}

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      page: Page.LOADING
    };

    AsyncStorage.getItem('lastPage')
    .then((item) => {
        if(item) {
          this.setState({
            page: Page[item as keyof typeof Page]
          });
        }
    });

    RNBackgroundService.RNBackgroundServiceLocationService.requestPermission();
    RNBackgroundService.RNBackgroundServiceLocationService.startLocationTracking();
  }

  setPage(page: Page) {
    this.setState({
      page: page
    });
    AsyncStorage.setItem('lastPage', Page[this.state.page]);
  }

  render() {
    switch(this.state.page) {
      case Page.MAPVIEW:
        return (<MapPhotoPage setPage={this.setPage}/>);
      case Page.LOADING:
        return (<ParsingPhotoPage setPage={this.setPage}/>);
      default:
        return (<View />);
    }
  }
}