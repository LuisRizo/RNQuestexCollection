import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Image, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TagComponent from '../components/TagComponent'
import DataService from '../lib/dataInstance'
import { mixWebsites, sortByDate } from '../lib/functions'
import glamorous from 'glamorous-native'
import _ from 'lodash'

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
      title: 'Tags',
    }
  }

  componentDidMount() {
    this.getTags()
    this.filterByTag('Products')
  }

  getArticleTags = article => {
    if (article.tags) {
      return article.tags.split(', ')
    }
    return null
  }

  getTags = () => {
    tags = {}
    data = DataService.get()
    if (Object.keys(data).length !== 0) {
      data = mixWebsites(data)
      data.map(item => {
        if (item.hasOwnProperty('tags')) {
          this.getArticleTags(item).map(tag => {
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

  filterByTag = tag => {
    let filteredData = []
    let data = _.cloneDeep(DataService.get())
    data = mixWebsites(data)
    data.map(item => {
      tags = this.getArticleTags(item)
      if (tags.includes(tag)) {
        filteredData.push(item)
      }
    })
    filteredData = sortByDate(filteredData)
    return filteredData
  }

  onPress = tagItem => {
    this.props.navigation.navigate('ArticleList', {
      data: this.filterByTag(tagItem.tag),
      loading: false,
      refreshing: false,
      tag: tagItem.tag,
    })
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
              <TagComponent
                tag={item.tag}
                onPress={() => this.onPress(item)}
                count={item.count}
              />
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
