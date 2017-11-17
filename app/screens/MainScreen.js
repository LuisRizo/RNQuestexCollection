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

  mixWebsites = async () => {
    var finalArray = [];
    var obj = await AsyncStorage.getItem('data', (err) => {
      if (err !== null) {
        console.log("mixWebsites error", err);
      }
    });
    obj = JSON.parse(obj);
    for (var v in obj) {
      if (obj.hasOwnProperty(v)) {
        finalArray = _.union(finalArray, obj[v]);
      }
    }
    return finalArray;
  }

  defaultFilter = () => {
    var array = [];
    this.setState({loading: true, filter: []});
    filter = [];
    AsyncStorage.setItem('filter', JSON.stringify(filter));
    this.mixWebsites()
    .then((array) => {
      //Sort them in order
      array.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
      });
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
            console.log("Finished getting Image data");
            var complete = true;
            //Preventing multiple saves in the AsyncStorage
            //To improve overall performance and only set loading to true
            //When all items have the image property.
            for (var v in obj) {
              if (obj.hasOwnProperty(v)) {
                var len = obj[v].length
                for (var i = 0; i < len; i++) {
                  if(!obj[v][i].hasOwnProperty('image')){
                    complete = false;
                    break;
                  }
                }
              }
            }
            if (complete) {
              console.log("Completed fetching all the data", obj);
              AsyncStorage.setItem('data', JSON.stringify(obj), (err) => {
                if (err !== null) {
                  console.log("downloadData error", err);
                }
              });
              this.defaultFilter();
            }
          })
        })
      })
    })
    console.log("End of websites");
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
    console.log(data);
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

  _filterData = (name) => {
    let filter = this.state.filter;
    this.mixWebsites()
    .then((data)=> {
      if (filter.includes(name)) {
        filter.splice(filter.indexOf(name), 1);
      }else {
        filter.push(name);
      }
      AsyncStorage.setItem('filter', JSON.stringify(filter));
      this.setState({filter: filter, loading: true});
      if (data !== null && Array.isArray(data)) {
        let count = 0;
        data = data.filter((item, index)=>{
          //If there's more data than the user wants, return false
          if (count >= this.state.amount) {
            return false;
          }
          for (var j = 0; j < filter.length; j++) {
            //If the website is in the filter list, remove it
            if (item.website === filter[j]) {
              return false;
            }
          }
          count++;
          return true;
        });
        this.setState({data: data, loading:false});
      }
    })
  }

  _onPressItem = (name) => {
    //TODO: Make this and _filterData and actions() more generic.
    console.log(name);
    switch (name) {
      case "bt_tac":
        this._filterData("Travel Agent Central")
        break;
      case "bt_lta":
        this._filterData("Luxury Travel Advisor")
        break;
      case "bt_as":
        this._filterData("American Spa")
        break;
      case "bt_count":
        this.toggleAmount();
        break;
      default:
        console.log("This should never happen");
    }
  }

  render(){
    return(
      <View style={styles.MainContainer}>
        {this.state.loading ? (
           <ActivityIndicator style={styles.ActivityIndicator} size={50}/>
        ) : (
          <FlatList
            data = {this.state.data}
            keyExtractor={(item, index) => item.url}
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
