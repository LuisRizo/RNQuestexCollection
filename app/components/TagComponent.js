import React, { Component } from 'react'
import glamorous, { Text } from 'glamorous-native'

const TagContainer = glamorous.touchableOpacity({
  padding: 5,
  margin: 10,
  backgroundColor: '#999',
  alignSelf: 'center',
  borderRadius: 4,
})

export default class Tag extends Component {
  render() {
    return (
      <TagContainer onPress={this.props.onPress}>
        <Text>{this.props.tag}</Text>
      </TagContainer>
    )
  }
}
