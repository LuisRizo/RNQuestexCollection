import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import html from '../data/SampleArticle.json'

import HtmlText from 'react-native-html-to-text'

export default class Article extends Component {
  render(){
    console.log(HtmlText);
    return(
      <View style={{flex:1}}>
        <HtmlText html={html[0].content}></HtmlText>
      </View>
    )
  }
}
