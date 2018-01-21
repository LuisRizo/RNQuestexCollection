// @flow
import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { View } from 'glamorous-native'
import MiniArticle from './MiniArticle'
import _ from 'lodash'

import Icon from 'react-native-vector-icons/FontAwesome'

import { Loader, Container, Button, BigText } from '../theme'

type Props = {
  loading: boolean,
  refreshing: boolean,
  handleRefresh: any,
  settings: any,
  data: any,
  navigation: any,
  refCallback: any,
}

export default class ArticleList extends Component<Props> {
  constructor(props: any) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      title: params.tag,
    }
  }

  _renderItem = ({ item }) => (
    <MiniArticle
      settings={this.props.settings}
      image={{ uri: item.image }}
      navigation={this.props.navigation}
      data={item}
    />
  )

  shouldComponentUpdate(nextProps: any, nextState: any) {
    // if (_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state)) {
    //   return false
    // }
    return true
  }

  render() {
    var { loading, refreshing, data, handleRefresh, refCallback } = this.props
    var params = this.props.navigation.state.params
    if (params && params.data) {
      loading = params.loading
      refreshing = params.refreshing
      handleRefresh = params.handleRefresh
      data = params.data
      refCallback = params.refCallback
    }
    console.log('Article list re-render', this.props.settings)
    return (
      <Container>
        {loading && !refreshing ? (
          <Loader color="#0000ff" size="large" />
        ) : data.length === 0 ? (
          <View flex={1} alignItems={'center'} justifyContent={'center'}>
            <BigText
              style={{
                textAlign: 'center',
              }}>
              {`It feels quite lonely around here... Mind changing the filters?`}
            </BigText>
            <Button text={'Refresh'} onPress={handleRefresh} />
          </View>
        ) : (
          <FlatList
            data={data}
            extraData={this.props.settings}
            keyExtractor={item => item.id}
            renderItem={this._renderItem}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ref={refCallback}
          />
        )}
      </Container>
    )
  }
}
