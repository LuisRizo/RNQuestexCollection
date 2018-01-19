import React, { Component } from 'react'
import { Text, View, StyleSheet, WebView } from 'react-native'

export default class ArticleWeb extends Component {
  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.state = {
      url: params.url || 'http://travelagentcentral.com',
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerMode: 'screen',
    tabBarOnPress: (scene, jumpToIndex) => {
      if (scene.focused && scene.route.key === 'HomeScreen') {
        navigation.goBack()
      } else {
        jumpToIndex(scene.index)
      }
    },
  })

  // {
  //   previousScene: {
  //     index: 0, routes: [{
  //       routeName: "homescreen",
  //       key: "initial123123",
  //       params: {}
  //     }],
  //     key: "HomeScreen",
  //     routeName: "HomeScreen"
  //   },
  //   scene: {
  //     route: {
  //       index: 0,
  //       routes: [{
  //         routeName: "HomeScreen",
  //         key: "ASDsdsa",
  //         params: {}
  //       }],
  //       key: "HomeScreen",
  //       routeName: "HomeScreen"
  //     },
  //     index: 0,
  //     focused: true
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <WebView source={{ uri: this.state.url }} style={{ marginTop: 20 }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
})
