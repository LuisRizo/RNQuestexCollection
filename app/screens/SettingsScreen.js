/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class SettingsScreen extends Component {

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;

    return {
      tabBarLabel: "Settings",
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="gear"
          style={{color: tintColor}}
          size={30}
        />
      ),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the SettingsScreen component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
