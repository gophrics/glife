import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
import RNBackgroundService from 'react-native-background-service';
import {Page} from './Modals/ApplicationEnums';
import MapPhotoPage from './Pages/MapPhotoPage';
import ParsingPhotoPage from './Pages/ParsingPhotoPage';


RNBackgroundService.RNBackgroundServiceLocationListener.addListener('LocationListener',
(res) => { console.log("Location: " + res) });


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
      page: Page[Page.NONE],
      pageDataPipe: {} 
    };

    AsyncStorage.getItem('lastPage')
      .then((item) => {
          if(item) {
            AsyncStorage.getItem('lastPageDataPipe')
              .then((item2) => {
                if(item2) {
                  console.log(item);
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



    RNBackgroundService.RNBackgroundServiceLocationService.requestPermission();
    RNBackgroundService.RNBackgroundServiceLocationService.startLocationTracking();
  }

  setPage(page: string, data: any) {
    this.state.pageDataPipe[page] = data;
    AsyncStorage.setItem('lastPage', page);
    AsyncStorage.setItem('lastPageDataPipe', JSON.stringify(this.state.pageDataPipe));
    this.setState({
      page: page
    });
  }

  render() {
    switch(this.state.page) {
      case Page[Page.LOADING]:
        return (<ParsingPhotoPage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.LOADING]]}/>);
      case Page[Page.MAPVIEW]:
        return (<MapPhotoPage setPage={this.setPage.bind(this)} data={this.state.pageDataPipe[Page[Page.MAPVIEW]]}/>);
      default:
        return (<View />);
    }
  }
}