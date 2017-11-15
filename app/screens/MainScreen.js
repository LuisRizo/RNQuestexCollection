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
    this.props.navigation.setParams({ downloadData: this.downloadData_v2 });
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
          this.setState({
            loading: false,
            data: value
          });
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

  unite = (arr1, arr2, key) => {
    console.log(arr1, arr2);
    for (var i = 0; i < arr1.length; i++) {
      arr1[i][key] = arr2[i]
    }
    return arr1;
  }

  downloadData_v2 = () => {
    Websites.forEach((listItem, index) => {
      var url = listItem.url + syndication;
      fetch(url)
      .then((res)=>res.json())
      .then((json)=>{
        console.log(json);
        return {
          [listItem.title]: this.unite(json.items, json.items.map((item, index) => {
            return fetch(item.url)
            .then((d) => d.text())
          }), 'promise')
        }
        console.log("End of articles");
      })
      .then((obj) => {
        console.log("Last .then " , obj);
        obj[Object.keys(obj)[0]].map((item, index) => {

        })
      })
    })
    console.log("End of websites");
  }

  downloadData = () => {
    var object = {};
    this.setState({
      loading:true
    });
    Websites.forEach((listItem, index) => {
      object[listItem.title] = [];
      this._fetch(listItem.url + syndication, (json) => {
        console.log("Fetch completed");
        object[listItem.title] = json.items;

        //This will append fields like the image and the Website title
        // object[listItem.title].map((item, index) => {
        //   object[listItem.title][index]['website'] = listItem.title;
        //   loading = true;
        //   this.getImageUrl(item.url).then((imgUrl)=>{
        //     object[listItem.title][index]['image'] = imgUrl;
        //     loading = false;
        //   });
        // });

        obj = this.getImagesUrls(object, listItem)
        console.log("TESST", obj);
        AsyncStorage.mergeItem('data', JSON.stringify(obj), () => {
          AsyncStorage.getItem('data', (err, data) => {
            this.setState({
              loading: false,
              data: JSON.parse(data)
            });
          })
        });
      })
    });
  }

  getImagesUrls = (object, listItem) => {
    return object[listItem.title].map((item, index) => {
      object[listItem.title][index]['website'] = listItem.title;
      this.getImageUrl(item.url)
      .then((imgUrl)=>{
        object[listItem.title][index]['image'] = imgUrl;
        return object;
      });
    });
  }

  _fetch(url, callback){
    fetch(url)
    .then((data)=>data.json())
    .then((res)=>{
      //Save the data in AsyncStorage
      if (res.stat == "ok") {
        //If everything went well...
        callback(res);
        // console.log(Websites[i]);
        // AsyncStorage.mergeItem('data', JSON.stringify(object));
      }
    })
    .catch((err)=>{
        Alert.alert('Error',
          'We apologize for the incovenience, but there was error fetching data - Code: 1');
        console.log(err);
        console.log(url);
      })
    .done();
  }

  getImageUrl = async (url) => {
    const response = await fetch(url)
    const html = await response.text();

    return this.extractImageUrl(html);
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
    return(
      <View style={styles.MainContainer}>
        {this.state.loading ? (
           <ActivityIndicator style={styles.ActivityIndicator} size={50}/>
        ) : (
          <FlatList
            data = {this.state.data['Travel Agent Central']}
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
