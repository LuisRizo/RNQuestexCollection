/* @flow */

import React, { Component } from 'react'
import { StyleSheet, Switch, Slider } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import glamorous, { View, Text, ScrollView } from 'glamorous-native'
import { Row } from '../theme'
import DataService from '../lib/dataInstance'

type Props = {
  navigation: any,
}

type State = {
  textSize: number,
  showThumbnail: boolean,
}

const SettingsItem = glamorous.view({
  margin: 7,
  padding: 10,
  borderWidth: 1,
  borderColor: 'lightgrey',
  alignItems: 'stretch',
})

export default class SettingsScreen extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showThumbnail: true,
      textSize: 15,
    }
  }
  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="gear" style={{ color: tintColor }} size={30} />
      ),
    }
  }

  componentDidMount() {
    const settings = DataService.get('settings')
    if (settings) {
      this.setState({ ...settings })
    }
  }

  _onSwitchChange = (val: boolean) => {
    this.setState({ showThumbnail: val })
    this.saveSettings({ showThumbnail: val })
  }

  _onValueChange = (val: number) => {
    this.setState({ textSize: val })
  }

  saveSettings = obj => {
    if (obj) {
      DataService.set({ ...this.state, ...obj }, 'settings')
    } else {
      DataService.set(this.state, 'settings')
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
              <Text>Show Thumbnail</Text>
              <Switch
                onValueChange={this._onSwitchChange}
                value={this.state.showThumbnail}
              />
            </Row>
          </SettingsItem>
          <SettingsItem>
            <Row>
              <Text>Text Size of Article Summary</Text>
              <View flexDirection={'row'} alignItems={'center'}>
                <Text>{this.state.textSize}</Text>
                <Slider
                  style={{
                    width: 130,
                  }}
                  step={1}
                  maximumValue={30}
                  minimumValue={8}
                  onValueChange={this._onValueChange}
                  onSlidingComplete={() => this.saveSettings()}
                  value={this.state.textSize}
                />
              </View>
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
