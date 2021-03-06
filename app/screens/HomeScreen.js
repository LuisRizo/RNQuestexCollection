import React, { Component } from 'react'
import { Alert, AsyncStorage } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import _ from 'lodash'

import MiniArticle from '../components/MiniArticle'
import ArticleList from '../components/ArticleList'

import { Button } from '../theme'

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

//TODO: This application does not handle missing internet access at all.
//It will throw a lot of warnings and possibly errors (hasn't happened to me yet) when
//Disconnected from the internet
//Implementing try-catches is a good idea to prevent these warnings and even show an alert or a modal.

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
    let homeOnPress = navObj => {
      const { scene, jumpToIndex } = navObj
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
            marginBottom: 10,
            backgroundColor: '#3498db',
            borderRadius: 3,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowRadius: 3,
            shadowOpacity: 0.4,
          }}
          onPress={params.openFilter}
        />
      ),
      tabBarLabel: 'Home',
      tabBarOnPress: homeOnPress,
    }
  }

  openFilter = () => {
    DataService.set({ empty: 'object' }, 'test')
    // this.props.navigation.navigate('FilterModal', {
    //   filter: this.state.filter,
    //   saveFilter: this.saveFilter,
    // })
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
    data = this.getData()
    if (data && Object.keys(data).length === 0) {
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
    DataService.clean('data')
  }

  defaultFilter = () => {
    var array = []
    filter = defaultFilterObj
    this.setState({ loading: true, filter: filter })
    AsyncStorage.setItem('filter', JSON.stringify(filter))
    array = mixWebsites()
    //Sort them in order
    array = sortByDate(array)
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
        if (value != null && Object.keys(value).length > 0) {
          this.defaultFilter()
        } else {
          //No data was found, fetch for new data
          // alert('No data was found ' + value)
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
    previousData = this.getData()
    Websites.forEach((listItem, index) => {
      var url = listItem.url + syndication
      fetch(url)
        .then(res => res.json())
        .then(json => {
          //TODO: This is the most expensive part of the app. In order to improve it, we can prevent
          //the fetching of specific articles if were already fetched previously and are stored in
          //AsyncStorage.
          //Something like:
          // (1) - First part of the code for this TODO
          // if (previousData) {
          //   currentWebsiteData = previousData[listItem.title]
          // }
          json.items.map((item, index) => {
            item.url = makeUrlHttps(item.url)
            // (2) - Second part of the code for the TODO above
            // if (currentWebsiteData) {
            //   articleFound = currentWebsiteData.filter(
            //     singleItem => singleItem.id === item.id
            //   )
            //   if (articleFound.length !== 0) {
            //     obj[listItem.title] = json.items
            //     obj[listItem.title][index] = articleFound
            //   }
            // } else {...
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
                  DataService.set(obj, 'data')
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
    let data = _.cloneDeep(DataService.get('data'))
    return data
  }

  filterData = filterList => {
    this.setState({ loading: true })
    /** Filter logic goes here*/
    if (!filterList) {
      filterList = this.state.filter
    }
    data = this.getData()
    data = this.filterBySite(data, filterList.sites)
    var arr = mixWebsites(data)
    arr = sortByDate(arr)
    this.setState({ data: arr, loading: false, refreshing: false })
  }

  filterBySite = (data, filter) => {
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
        refCallback={el => (this.listRef = el)}
      />
    )
  }
}
