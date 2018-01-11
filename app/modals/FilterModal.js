/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Container, Button, Header, HeaderText, HeaderRightButton } from '../theme'

export default class FilterModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'LTA': true,
      'TAC': true,
      'AS': true,
    };
  }

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;

    return {
      header: <Header>
        <TouchableWithoutFeedback onPress={params.saveFilter}>
          <HeaderRightButton>
            <HeaderText>
              Save
            </HeaderText>
          </HeaderRightButton>
        </TouchableWithoutFeedback>
      </Header>,
      tabBarLabel: "Home",
      tabBarOnPress: (scene, jumpToIndex) => {
        navigation.goBack();
      }
    };
  };

  componentDidMount(prevProps, prevState) {
    let {filter} = this.navigation.state.params;
    this.setState({
      
    })
  }

  render() {
    return (
      <Container>
        <Text>I'm the FilterModal component {this.props.navigation.state.params.test}</Text>
      </Container>
    );
  }
}
