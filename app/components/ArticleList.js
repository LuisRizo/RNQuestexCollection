// @flow
import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { View } from 'glamorous-native'
import MiniArticle from './MiniArticle'
import _ from 'lodash'
import DataService from '../lib/dataInstance'

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

type State = {
  settings: any,
}

export default class ArticleList extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      settings: null,
    }
  }

  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      title: params.tag,
    }
  }

  componentDidMount() {
    this.setState({
      settings: DataService.get('settings'),
    })
  }

  _renderItem = ({ item }) => (
    <MiniArticle
      settings={this.state.settings}
      image={{ uri: item.image }}
      navigation={this.props.navigation}
      data={item}
    />
  )

  componentDidUpdate(prevProps, prevState) {
    let settings = DataService.get('settings')
    if (_.isEqual(prevState.settings, settings)) {
      return
    }
    this.setState({ settings })
  }

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
            extraData={this.state.settings}
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
