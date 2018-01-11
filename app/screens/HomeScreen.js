import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'

import { FloatingAction } from 'react-native-floating-action';

import _ from 'lodash'

import MiniArticle from '../components/MiniArticle'

import { Loader, Container, Button } from '../theme'

const syndication = "/syndication/newscred";
const Websites = [
  {
    title: "Luxury Travel Advisor",
    url: 'https://www.luxurytraveladvisor.com'
  },
  {
    title: "Travel Agent Central",
    url: 'https://www.travelagentcentral.com'
  },
  {
    title: "American Spa",
    url: 'https://www.americanspa.com'
  },
];


getDefaultFilterObj = () => {
  filter = {
    sites: {}
  }
  for (site of Websites) {
    filter.sites[site.title] = true
  }

  return filter;
}

var defaultFilterObj = getDefaultFilterObj();

const myIcon = (<Icon name="rocket" size={30} color="#900" />);

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.timeOutId = null;
    this.state = {
      loading: true,
      data: [],
      amount: 60,
      filter: [],
      refreshing: false,
    }
  }

  actions = () => [{
    text: 'Travel Agent Central',
    icon: <Text>TAC</Text>,
    name: 'bt_tac',
    position: 2
  }, {
    text: 'American Spa',
    icon: <Text>AS</Text>,
    name: 'bt_as',
    position: 1
  }, {
    text: 'Luxury Travel Advisor',
    icon: <Text>LTA</Text>,
    name: 'bt_lta',
    position: 3
  }];
  // , {
  //   text: 'Count',
  //   icon: <Text>{this.state.amount}</Text>,
  //   name: 'bt_count',
  //   position: 4
  // }

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;
    let headerRight = (<Button marginRight={10} title="Refresh"
        onPress={params.downloadData ? params.downloadData : () => null}
      />);

    let homeOnPress = (scene, jumpToIndex) => {
      if (scene.route.routeName === "HomeScreen" && scene.focused) {
        params.scrollToTop();
      }else {
        jumpToIndex(scene.route.index)
      }
    }

    return {
      headerRight: <Button
        text="Filter"
        containerStyle={{marginRight: 10, backgroundColor:'#3498db'}}
        onPress={params.openFilter}
      />,
      tabBarLabel: "Home",
      tabBarOnPress: homeOnPress
    };
  };

  openFilter = () => {
    this.props.navigation.navigate('FilterModal', {filter: this.state.filter});
  }

  componentWillMount(){
    // this.checkStore();
  }


  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.checkStore();
    this.props.navigation.setParams({
      downloadData: this.downloadData,
      clearAsyncStorage: this.clearAsyncStorage,
      scrollToTop: this.scrollToTop,
      openFilter: this.openFilter
    });
    if (this.state.loading) {
      this.timeOutId = setTimeout(() => {
        //If it is still loading...
        if (this.state.loading) {
          alert('Taking too long to receive data... Resetting app')
          this.clearAsyncStorage();
          this.setState({
            loading: false,
            data: []
          }, () => {
            this.downloadData()
          })
        }
      }, 1500);
    }
  }

  scrollToTop = () => {
    this.listRef.scrollToOffset({x: 0, y: 0, animated: true});
  }

  saveFilter = (filter) => {

  }

  clearAsyncStorage = () => {
    AsyncStorage.removeItem('data', (err) => {
      if (err !== null) {
        console.log("clearAsyncStorage error", err);
      }
    })
  }

  mixWebsites = async (obj) => {
    var finalArray = [];
    if (obj === undefined) {
      obj = await AsyncStorage.getItem('data', (err) => {
        if (err !== null) {
          console.log("mixWebsites error", err);
        }
      });
      obj = JSON.parse(obj);
    }
    for (var v in obj) {
      if (obj.hasOwnProperty(v)) {
        finalArray = _.union(finalArray, obj[v]);
      }
    }
    return finalArray;
  }

  sortByDate(array){
    return array.sort(function(a, b) {
        //The default constructor of date (Date(a.date)) only works on Debug mode
        //This caused the real device to display articles in random orders.
        //https://github.com/facebook/react-native/issues/13195
        a = new Date(a.date.slice(0, a.date.lastIndexOf('-')));
        b = new Date(b.date.slice(0, b.date.lastIndexOf('-')));
        return a>b ? -1 : a<b ? 1 : 0;
    });
  }

  defaultFilter = () => {
    var array = [];
    filter = defaultFilterObj;
    this.setState({loading: true, filter: filter});
    AsyncStorage.setItem('filter', JSON.stringify(filter));
    this.mixWebsites()
    .then((array) => {
      //Sort them in order
      array = this.sortByDate(array);
      //Only keep the last 20
      array.filter((item, index) => {
        if (index<this.state.amount)
          return true;
        return false;
      });
      this.setState({
        loading: false,
        data: array
      });
    })
  }

  checkStore = async ()  => {
    if (this.state.data.length == 0) {
      try {
        //Try to make sure that there is no data in AsyncStorage
        //Before fetching
        //TODO: Store the date that the data was collected
        //So we can refresh the data in case it is too old.
        const value = await this.getData();
        if (value !== null) {
          this.defaultFilter();
        }else {
          //No data was found, fetch for new data
          this.downloadData();
        }
      }catch (error){
        Alert.alert('Error',
        'We apologize for the incovenience, but there was an error fetching data - Code: 0');
        console.log(error);
      }
    }
  }

  makeUrlHttps = (url) => {
    if (url.split(":")[0] === "http") {
      return "https:" + url.split(":")[1];
    }
    return url;
  }

  downloadData = () => {
    var obj = {};
    this.setState({
      loading:true
    });
    Websites.forEach((listItem, index) => {
      var url = listItem.url + syndication;
      fetch(url)
      .then((res)=>res.json())
      .then((json)=>{
        json.items.map((item, index) => {
          item.url = this.makeUrlHttps(item.url);
          fetch(item.url)
          .then((r) => r.text())
          .then((html) => {
            var imgUrl = this.extractImageUrl(html);
            obj[listItem.title] = json.items;
            obj[listItem.title][index]['image'] = imgUrl;
            obj[listItem.title][index]['website'] = listItem.title;
          })
          .finally(()=>{
            var complete = true;
            //Preventing multiple saves in the AsyncStorage
            //To improve overall performance and only set loading to true
            //When all items have the image property.
            for (var i = 0; i < Websites.length; i++) {
              var v = Websites[i].title;
              if (obj.hasOwnProperty(v)) {
                var len = obj[v].length
                for (var j = 0; j < len; j++) {
                  if(!obj[v][j].hasOwnProperty('image')){
                    complete = false;
                    break;
                  }
                }
              }else{
                complete = false;
                break;
              }
            }
            if (complete) {
              AsyncStorage.setItem('data', JSON.stringify(obj), (err) => {
                if (err !== null) {
                  console.log("downloadData error", err);
                }
              }).then(()=>{
                this.filterData();
              })
            }
          })
        })
      })
    })
  }

  extractImageUrl = (html) => {
    if (html.includes('<img srcset="')) {
      var imageUrl = html.split('<img srcset="')[1].split(' ')[0];
      return imageUrl;
    }else{
      //URL for default image
      return "http://www.questex.com/themes/horizon_questex/logo.svg"
    }
  }

  getData = async () => {
    let data = await AsyncStorage.getItem('data');
    data = JSON.parse(data);
    return data;
  }

  _renderItem = ( { item } ) => (
    <MiniArticle image={{uri: item.image}} navigation={this.props.navigation} data={item} />
  )

  toggleAmount = () => {
    if (this.state.amount == 20) {
      this.setState({amount: 100});
    }else {
      //20 articles decrement per click
      this.setState({amount: this.state.amount - 20});
    }
  }

  filterData = async (filterList) => {
    this.setState({loading: true});
    /** Filter logic goes here*/
    this.getData()
    .then((data)=> {
      this.mixWebsites(data)
      .then((arr) => {
        arr = this.sortByDate(arr);
        this.setState({data: arr, loading:false, refreshing: false});
      });
    })
  }

  handleRefresh = () => {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
    }
    this.setState({
      refreshing: true,
    }, () => {
      this.downloadData()
    });
  }

  render(){
    return(
      <Container>
        {this.state.loading && !this.state.refreshing ? (
           <Loader color="#0000ff" size="large"/>
        ) : (
          <FlatList
            data = {this.state.data}
            keyExtractor={(item, index) => item.id}
            renderItem={this._renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            ref={ref => this.listRef = ref}
          />
        )}
      </Container>
    )
  }
}
