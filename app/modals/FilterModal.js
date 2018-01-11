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

  saveFilter = () => {
    this.props.navigation.goBack();
  }

  componentDidMount(prevProps, prevState) {
    this.props.navigation.setParams({
      saveFilter: this.saveFilter
    })
    let {filter} = this.props.navigation.state.params;
    this.setState({
      filter: filter
    })
  }

  render() {
    return (
      <Container>
        <Text>I'm the FilterModal component</Text>
      </Container>
    );
  }
}
