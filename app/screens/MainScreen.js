import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'

import { FloatingAction } from 'react-native-floating-action';

import _ from 'lodash'

import MiniArticle from '../components/MiniArticle'

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

const myIcon = (<Icon name="rocket" size={30} color="#900" />);

export default class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      data: [],
      amount: 60,
      filter: []
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
  }, {
    text: 'Count',
    icon: <Text>{this.state.amount}</Text>,
    name: 'bt_count',
    position: 4
  }];

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;
    let headerRight = (<Button style={{marginRight:10}} title="Download data"
        onPress={params.downloadData ? params.downloadData : () => null}
      />);

    return { title: "Welcome", headerRight };
  };

  componentWillMount(){
    this.checkStore();
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.checkStore();
    this.props.navigation.setParams({ downloadData: this.downloadData, clearAsyncStorage: this.clearAsyncStorage });
    if (this.state.loading) {
      setTimeout(() => {
        //If it is still loading...
        if (this.state.loading) {
          alert('Taking too long to receive data... Resetting app')
          this.clearAsyncStorage();
          this.setState({
            loading: false,
            data: []
          })
        }
      }, 1000);
    }
  }

  clearAsyncStorage = () => {
    AsyncStorage.removeItem('data', (err) => {
      if (err !== null) {
        console.log("clearAsyncStorage error", err);
      }
    });
    this.setState({
      loading: false,
      data: []
    });
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
    this.setState({loading: true, filter: []});
    filter = [];
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
    if (filterList == undefined) {
      filterList = await AsyncStorage.getItem('filter', (err) => {
        if (err !== null) {
          console.log("Error fetching filter ", err);
        }
      });
      filterList = JSON.parse(filterList);
    }
    this.getData()
    .then((data)=> {
      //If the filter is empty
      if (filterList && filterList.length !== 0) {
        for (var i = 0; i < filterList.length; i++) {
          delete data[filterList[i]]
        }
      }
      this.mixWebsites(data)
      .then((arr) => {
        arr = this.sortByDate(arr);
        data = this.filterAmount(arr);
        this.setState({data: data, loading:false});
      });
    })
  }

  filterAmount = (arr, amount) => {
    var newArr = [];
    if (amount === undefined) {
      amount = this.state.amount;
    }
    if (Array.isArray(arr)) {
      let max = (amount<arr.length ? amount : arr.length);
      for (var i = 0; i < max; i++) {
        newArr[i] = arr[i];
      }
    }
    return newArr;
  }


  addToFilter = (name) => {
    let filter = this.state.filter;
    if (filter.includes(name)) {
      filter.splice(filter.indexOf(name), 1);
    }else {
      filter.push(name);
    }
    AsyncStorage.setItem('filter', JSON.stringify(filter));
    this.setState({filter: filter});
  }

  _onPressItem = (name) => {
    //TODO: Make this and addToFilter and actions() more generic.
    switch (name) {
      case "bt_tac":
        this.addToFilter("Travel Agent Central")
        break;
      case "bt_lta":
        this.addToFilter("Luxury Travel Advisor")
        break;
      case "bt_as":
        this.addToFilter("American Spa")
        break;
      case "bt_count":
        this.toggleAmount();
        break;
      default:
        console.log("This should never happen");
        return;
    }
    this.filterData();
  }

  render(){
    return(
      <View style={styles.MainContainer}>
        {this.state.loading ? (
           <ActivityIndicator style={styles.ActivityIndicator} size={50}/>
        ) : (
          <FlatList
            data = {this.state.data}
            keyExtractor={(item, index) => item.id}
            renderItem={this._renderItem}
          />
        )}
        <FloatingAction
          actions={this.actions()}
          floatingIcon={<Icon name="filter" size={30}/>}
          onPressItem={this._onPressItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex:1,
    alignItems:'stretch',
    backgroundColor:'white',
    justifyContent:'flex-start',
  },
  ActivityIndicator:{
    margin: 20,
  }
});
