import React, { Component } from 'react'
import {
  Image,
  Alert,
  FlatList,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import { FloatingAction } from 'react-native-floating-action'

import _ from 'lodash'

import MiniArticle from '../components/MiniArticle'
import ArticleList from '../components/ArticleList'

import { Loader, Container, Button, BigText } from '../theme'
import glamorous from 'glamorous-native'
const { View, Text } = glamorous

import DataService from '../lib/dataInstance/'
import { mixWebsites, makeUrlHttps, sortByDate } from '../lib/functions'

const syndication = '/syndication/newscred'
const Websites = [
  {
    title: 'Luxury Travel Advisor',
    url: 'https://www.luxurytraveladvisor.com',
  },
  {
    title: 'Travel Agent Central',
    url: 'https://www.travelagentcentral.com',
  },
  {
    title: 'American Spa',
    url: 'https://www.americanspa.com',
  },
]

getDefaultFilterObj = () => {
  filter = {
    sites: {},
  }
  for (site of Websites) {
    filter.sites[site.title] = true
  }

  return filter
}

var defaultFilterObj = getDefaultFilterObj()

const myIcon = <Icon name="rocket" size={30} color="#900" />

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.timeOutId = null
    this.state = {
      loading: true,
      data: [],
      amount: 60,
      filter: {},
      refreshing: false,
    }
  }

  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state
    let headerRight = (
      <Button
        marginRight={10}
        title="Refresh"
        onPress={params.downloadData ? params.downloadData : () => null}
      />
    )

    let homeOnPress = (scene, jumpToIndex) => {
      if (scene.focused && scene.route.key === 'HomeScreen') {
        params.scrollToTop()
      } else {
        jumpToIndex(scene.route.index)
      }
    }

    return {
      headerRight: (
        <Button
          text="Filter"
          containerStyle={{
            marginRight: 10,
            backgroundColor: '#3498db',
          }}
          onPress={params.openFilter}
        />
      ),
      tabBarLabel: 'Home',
      tabBarOnPress: homeOnPress,
    }
  }

  openFilter = () => {
    this.props.navigation.navigate('FilterModal', {
      filter: this.state.filter,
      saveFilter: this.saveFilter,
    })
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.checkStore()
    this.props.navigation.setParams({
      downloadData: this.downloadData,
      clearData: this.clearData,
      scrollToTop: this.scrollToTop,
      openFilter: this.openFilter,
    })
    if (this.state.loading) {
      this.timeOutId = setTimeout(() => {
        //If it is still loading...
        if (this.state.loading) {
          alert('Taking too long to receive data... Resetting app')
          this.clearData()
          this.setState(
            {
              loading: false,
              data: [],
            },
            () => {
              this.downloadData()
            }
          )
        }
      }, 2500)
    }
    if (Object.keys(this.getData()).length === 0) {
      console.log('No data found. Downloading new data')
      this.clearData()
      this.setState(
        {
          loading: false,
          data: [],
        },
        () => {
          this.downloadData()
        }
      )
    }
  }

  scrollToTop = () => {
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true })
  }

  saveFilter = filter => {
    this.setState({
      filter: {
        ...this.state.filter,
        ...filter,
      },
    })
    this.filterData(filter)
  }

  clearData = () => {
    DataService.clean()
  }

  defaultFilter = () => {
    var array = []
    filter = defaultFilterObj
    this.setState({ loading: true, filter: filter })
    AsyncStorage.setItem('filter', JSON.stringify(filter))
    array = mixWebsites()
    //Sort them in order
    array = sortByDate(array)
    // //Only keep the last 20
    // array.filter((item, index) => {
    //   if (index<this.state.amount)
    //     return true;
    //   return false;
    // });
    this.setState({
      loading: false,
      data: array,
    })
  }

  checkStore = () => {
    if (this.state.data.length == 0) {
      try {
        //Try to make sure that there is no data in AsyncStorage
        //Before fetching
        //TODO: Store the date that the data was collected
        //So we can refresh the data in case it is too old.
        const value = this.getData()
        if (value !== null && Object.keys(value).length > 0) {
          this.defaultFilter()
        } else {
          //No data was found, fetch for new data
          this.downloadData()
        }
      } catch (error) {
        // Alert.alert(
        //   'Error',
        //   'We apologize for the incovenience, but there was an error fetching data - Code: 0'
        // )
        console.warn(error)
      }
    }
  }

  downloadData = () => {
    var obj = {}
    this.setState({
      loading: true,
    })
    Websites.forEach((listItem, index) => {
      var url = listItem.url + syndication
      fetch(url)
        .then(res => res.json())
        .then(json => {
          json.items.map((item, index) => {
            item.url = makeUrlHttps(item.url)
            fetch(item.url)
              .then(r => r.text())
              .then(html => {
                var imgUrl = this.extractImageUrl(html)
                obj[listItem.title] = json.items
                obj[listItem.title][index]['image'] = imgUrl
                obj[listItem.title][index]['website'] = listItem.title
              })
              .finally(() => {
                var complete = true
                //Preventing multiple saves in the AsyncStorage
                //To improve overall performance and only set loading to true
                //When all items have the image property.
                for (var i = 0; i < Websites.length; i++) {
                  var v = Websites[i].title
                  if (obj.hasOwnProperty(v)) {
                    var len = obj[v].length
                    for (var j = 0; j < len; j++) {
                      if (!obj[v][j].hasOwnProperty('image')) {
                        complete = false
                        break
                      }
                    }
                  } else {
                    complete = false
                    break
                  }
                }
                if (complete) {
                  DataService.set(obj)
                  this.filterData()
                }
              })
          })
        })
    })
  }

  extractImageUrl = html => {
    if (html.includes('<img srcset="')) {
      var imageUrl = html.split('<img srcset="')[1].split(' ')[0]
      return imageUrl
    } else {
      //URL for default image
      return 'http://www.questex.com/themes/horizon_questex/logo.svg'
    }
  }

  getData = () => {
    let data = _.cloneDeep(DataService.get())
    return data
  }

  _renderItem = ({ item }) => (
    <MiniArticle
      image={{ uri: item.image }}
      navigation={this.props.navigation}
      data={item}
    />
  )

  filterData = filterList => {
    this.setState({ loading: true })
    /** Filter logic goes here*/
    if (!filterList) {
      filterList = this.state.filter
    }
    data = this.getData()
    console.log(data)
    data = this.filterBySite(data, filterList.sites)
    var arr = mixWebsites(data)
    arr = sortByDate(arr)
    this.setState({ data: arr, loading: false, refreshing: false })
  }

  filterBySite = (data, filter) => {
    console.log(data, filter)
    if (!filter) {
      filter = this.state.filter.sites
    }
    for (var site in filter) {
      //If site=false, remove from data
      if (!filter[site]) {
        delete data[site]
      }
    }
    return data
  }

  handleRefresh = () => {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId)
    }
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.downloadData()
      }
    )
  }

  render() {
    return (
      <ArticleList
        loading={this.state.loading}
        refreshing={this.state.refreshing}
        handleRefresh={this.handleRefresh}
        data={this.state.data}
        navigation={this.props.navigation}
        refCallback={ref => (this.listRef = ref)}
      />
    )
  }
}
