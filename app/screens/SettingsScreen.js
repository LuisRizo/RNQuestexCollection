/* @flow */

import React, { Component } from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import glamorous, { ScrollView } from 'glamorous-native'
import { Row } from '../theme'

type Props = {
  navigation: any,
}

type State = {}

const SettingsItem = glamorous.view({
  margin: 7,
  padding: 10,
  borderWidth: 1,
  borderColor: 'lightgrey',
  alignItems: 'stretch',
})

export default class SettingsScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="gear" style={{ color: tintColor }} size={30} />
      ),
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'stretch' }}
          marginTop={20}
          flex={1}>
          <SettingsItem>
            <Row>
              <Text>First Settings</Text>
              <Switch />
            </Row>
          </SettingsItem>
          <SettingsItem>
            <Row>
              <Text>First Settings</Text>
              <Switch />
            </Row>
          </SettingsItem>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
