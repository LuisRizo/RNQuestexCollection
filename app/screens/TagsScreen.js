import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Image, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TagComponent from '../components/TagComponent'
import DataService from '../lib/dataInstance'
import { mixWebsites } from '../lib/functions'
import glamorous from 'glamorous-native'

const TagsList = glamorous.view({
  alignItems: 'flex-start',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
})

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
            if (tags.hasOwnProperty(tag)) {
              tags[tag].count += 1
            } else {
              tags[tag] = { count: 1 }
            }
          })
        }
      })
      tagsArray = []
      for (let item in tags) {
        tagsArray.push({ tag: item, count: tags[item].count })
      }
      tagsArray.sort((a, b) => {
        return b.count - a.count
      })
      return tagsArray
    }
    return null
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            numColumns={2}
            data={this.getTags()}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{
              alignItems: 'center',
            }}
            renderItem={({ item }) => (
              <TagComponent tag={item.tag} count={item.count} />
            )}
          />
        </View>
        {/* <TagsList>
          <TagComponent tag={'Business'} />
          {this.getTags().map((tag, index) => {
            return <TagComponent key={index} tag={tag.tag} />
          })}
        </TagsList> */}
      </View>
    )
  }
}
