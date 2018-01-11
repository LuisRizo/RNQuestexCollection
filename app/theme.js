import React, { Component } from 'react';
import glamorous, { TouchableOpacity, TextInput } from 'glamorous-native'

import {
  ActivityIndicator
} from 'react-native'

const myLoader = props => <ActivityIndicator {...props} />

export const Container = glamorous.view({
  flex:1,
  alignItems:'stretch',
  backgroundColor:'white',
  justifyContent:'flex-start',
})

const GlamorousLoaderFactory = glamorous(myLoader)

export const Loader = GlamorousLoaderFactory({
  alignSelf:'center',
  width: 100,
  height: 100,
  margin: 20,
})

export const Header = glamorous.view({
  height: 60,
  paddingTop: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'white'
})

export const HeaderRightButton = glamorous.view({
  position: 'absolute',
  right: 10,
  top: 17,
})

export const HeaderText = glamorous.text({
  fontSize: 20,
  fontWeight: '700',
  color: '#00BCD4'
})

const ButtonText = glamorous.text({
    color: '#fff',
})
const ButtonWrapper = glamorous.touchableOpacity({
    width: 80,
    height: 40,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center'
})
const BottomButtonWrapper = glamorous.touchableOpacity({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 66,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center'
})

export const Button = (props) => (
    <ButtonWrapper
        style={props.containerStyle}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
    >
        <ButtonText style={props.textStyle}>
            {props.text || 'Submit'}
        </ButtonText>
    </ButtonWrapper>
)
