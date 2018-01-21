/* @flow */
import React, {Component} from 'react'
import {
  Row,
  Selector,
} from '../theme'
import glamorous from 'glamorous-native'

const {View, Text} = glamorous;

export default class SwitchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: true
    }
  }

  handleChange = (value) => {
    this.setState({
      value: value
    })
  }

  render() {
    return (
      <Row
        marginLeft={15}
        marginRight={15}
        paddingLeft={20}
        borderColor="grey"
        borderBottomWidth={1}>
        <View>
          <Text
            fontSize={17}
            >
              {this.props.text}
            </Text>
        </View>
        <View
          marginRight={5}
        >
          <Selector
            value={this.props.value == null ? this.state.value : this.props.value}
            onValueChange={this.props.onValueChange || this.handleChange}
            disabled={this.props.disabled}
            style={this.props.style}
            ref={this.props.refCallback}
          />
        </View>
      </Row>
    );
  }
}
