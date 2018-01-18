import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'

import Switch from '../components/SwitchComponent'
import {
  Container,
  Button,
  Header,
  HeaderText,
  HeaderRightButton,
  BigText,
} from '../theme'

export default class FilterModal extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {
    let { params = {} } = navigation.state

    return {
      header: (
        <Header>
          <TouchableWithoutFeedback onPress={params.save}>
            <HeaderRightButton>
              <HeaderText>Save</HeaderText>
            </HeaderRightButton>
          </TouchableWithoutFeedback>
        </Header>
      ),
      tabBarLabel: 'Home',
      tabBarOnPress: (scene, jumpToIndex) => {
        if (scene.focused) {
          navigation.goBack()
        } else {
          jumpToIndex(scene.index)
        }
      },
    }
  }

  save = () => {
    this.props.navigation.state.params.saveFilter(this.state)
    this.props.navigation.goBack()
  }

  componentDidMount(prevProps, prevState) {
    this.props.navigation.setParams({
      save: this.save,
    })
    let { filter } = this.props.navigation.state.params
    this.setState({
      ...filter,
    })
  }

  handleChange = (value, site) => {
    this.setState({
      sites: {
        ...this.state.sites,
        [site]: value,
      },
    })
  }

  render() {
    const siteSwitches =
      this.state.sites &&
      Object.keys(this.state.sites).map(site => {
        return (
          <Switch
            key={site}
            text={site}
            onValueChange={value => this.handleChange(value, site)}
            value={this.state.sites[site]}
          />
        )
      })

    return (
      <Container>
        <BigText>Sites</BigText>
        {siteSwitches}
      </Container>
    )
  }
}
