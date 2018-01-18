// @flow
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

import MiniArticle from './MiniArticle'

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

const myIcon = <Icon name="rocket" size={30} color="#900" />

type Props = {
  loading: boolean,
  refreshing: boolean,
  handleRefresh: any,
  data: any,
  navigation: any,
  refCallback: any,
}

export default class ArticleList extends Component<Props> {
  constructor(props: any) {
    super(props)
  }

  _renderItem = ({ item }) => (
    <MiniArticle
      image={{ uri: item.image }}
      navigation={this.props.navigation}
      data={item}
    />
  )

  render() {
    return (
      <Container>
        {this.props.loading && !this.props.refreshing ? (
          <Loader color="#0000ff" size="large" />
        ) : this.props.data.length === 0 ? (
          <View flex={1} alignItems={'center'} justifyContent={'center'}>
            <BigText
              style={{
                textAlign: 'center',
              }}>
              {`It feels quite lonely around here... Mind changing the filters?`}
            </BigText>
            <Button text={'Refresh'} onPress={this.props.handleRefresh} />
          </View>
        ) : (
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => item.id}
            renderItem={this._renderItem}
            refreshing={this.props.refreshing}
            onRefresh={this.props.handleRefresh}
            ref={this.props.refCallback}
          />
        )}
      </Container>
    )
  }
}
