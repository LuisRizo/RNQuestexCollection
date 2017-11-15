import React, {Component} from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

import Article from './components/Article'
import ArticleWeb from './components/ArticleWeb'
import MiniArticle from './components/MiniArticle'

import MainScreen from './screens/MainScreen'

import {
  StackNavigator,
} from 'react-navigation';

const Navigator = StackNavigator({
  MainScreen: {screen: MainScreen},
  Article: {screen: Article},
  ArticleWeb: {screen: ArticleWeb},
  MiniArticle: {screen: MiniArticle},
});

// module.exports = App;

export default class app extends Component {
  render(){
    return(
        <View style={styles.container}>
          <Navigator/>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (Platform.OS === "android"?0:20), //Padding top 20 in case the OS is iOS
    //On Android this padding is already there by default
    backgroundColor: '#fff',
    justifyContent:'flex-start',
    alignItems:'stretch'
  },
});
