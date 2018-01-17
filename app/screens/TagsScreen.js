import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TagComponent from '../components/TagComponent'
import DataService from '../lib/dataInstance'

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
    console.log(data)
    if (data.length !== 0) {
      data.map(item => {
        if (item.hasOwnProperty('tags')) {
          item.tags.split(', ').map(tag => {
            if (tags.hasOwnProperty(tag)) {
              tags[tag].count += 1
            } else {
              tags[tag].count = 1
            }
          })
        }
      })
      tagsArray = []
      console.log(tags)
      for (const item of tags) {
        tagsArray.push({ tag: item, count: tags[item].count })
      }
      console.log(tagsArray)
      tagsArray.sort((a, b) => {
        return a.count - b.count
      })
      console.log(tagsArray)
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
