import React, { Component } from 'react'
import { Dimensions, Text } from 'react-native'
import glamorous, { View } from 'glamorous-native'

const TagContainer = glamorous.touchableOpacity({
  padding: 5,
  margin: 5,
  backgroundColor: 'white',
  flexDirection: 'row',
  borderColor: '#418FBE',
  borderWidth: 1,
  justifyContent: 'center',
  maxWidth: Dimensions.get('window').width / 2 - 15,
  borderRadius: 4,
})

const TagText = glamorous.text({
  marginLeft: 7,
  maxWidth: Dimensions.get('window').width / 3,
})

const CountContainer = glamorous.view({
  padding: 3,
  width: 25,
  height: 25,
  backgroundColor: 'grey',
  borderRadius: 4,
  marginHorizontal: 5,
  alignItems: 'center',
  justifyContent: 'center',
})
export default class Tag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    }
  }

  //TODO: Changing the background color on press works as long as the user does long presses
  //on short presses, the background color looks black.

  handlePressIn = () => {
    this.setState({ pressed: true })
  }

  handlePressOut = () => {
    this.setState({ pressed: false })
  }

  render() {
    const { pressed } = this.state
    return (
      <TagContainer
        // style={{ backgroundColor: pressed ? '#418FB4' : 'transparent' }}
        // onPressIn={this.handlePressIn}
        // onPressOut={this.handlePressOut}
        onPress={this.props.onPress}>
        <View>
          <TagText>{this.props.tag}</TagText>
        </View>
        <CountContainer>
          <Text color="white">{this.props.count}</Text>
        </CountContainer>
      </TagContainer>
    )
  }
}
