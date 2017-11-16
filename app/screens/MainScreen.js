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

export default class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      data: [],
    }
  }

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;
    let headerRight = (<Button style={{marginRight:10}} title="Download data"
      onPress={params.downloadData ? params.downloadData : () => null}/>);

    return { title: "Welcome", headerRight };
  };

  componentWillMount(){
    this.checkStore();
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ downloadData: this.downloadData });
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
      }, 5000);
    }
  }

  clearAsyncStorage = () => {
    AsyncStorage.removeItem('data');
  }

  mixWebsites = async () => {
    var finalArray = [];
    var obj = await AsyncStorage.getItem('data');
    obj = JSON.parse(obj);
    console.log(obj);
    for (var v in obj) {
      if (obj.hasOwnProperty(v)) {
        finalArray = _.union(finalArray, obj[v]);
      }
    }
    return finalArray;
  }

  defaultFilter = () => {
    var array = [];
    this.setState({loading: true})
    this.mixWebsites()
    .then((mix) => {
      array = mix;
      //Sort them in order
      array.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
      });
      //Only keep the last 20
      array.filter(function (item, index) {
        if (index<20)
          return true;
        return false;
      });
      console.log(array);
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
          console.log("No data was found, fetching new data");
          console.log(this.state);
          this.defaultFilter();
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
            console.log("Finished getting all the data...");
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
              AsyncStorage.setItem('data', JSON.stringify(obj), ()=>{
                this.setState({
                  loading:false,
                  data: obj
                })
              })
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

  render(){
    console.log(this.state);
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
