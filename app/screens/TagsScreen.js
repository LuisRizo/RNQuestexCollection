import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TagComponent from '../components/TagComponent'
import DataService from '../lib/dataInstance'
import { mixWebsites } from '../lib/functions'

export default class TagsScreen extends Component {
  constructor(props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      tabBarLabel: 'Tags',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="tags" style={{ color: tintColor }} size={30} />
      ),
    }
  }

  componentDidMount() {
    this.getTags()
  }

  getTags = () => {
    tags = {}
    data = DataService.get()
    if (Object.keys(data).length !== 0) {
      data = mixWebsites(data)
      data.map(item => {
        if (item.hasOwnProperty('tags')) {
          item.tags.split(', ').map(tag => {
            console.log(tags, tag)
            if (tags.hasOwnProperty(tag)) {
              tags[tag].count += 1
            } else {
              tags[tag] = { count: 1 }
            }
          })
        }
      })
      tagsArray = []
      console.log(tags)
      for (let item in tags) {
        tagsArray.push({ tag: item, count: tags[item].count })
      }
      console.log(tagsArray)
      tagsArray.sort((a, b) => {
        return a.count - b.count
      })
      console.log(tagsArray)
      return tagsArray
    }
    return null
  }

  render() {
    return (
      <View>
        <Text>This is the tags screen</Text>
        <TagComponent tag={'Business'} />
      </View>
    )
  }
}
