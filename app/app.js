import React, {Component} from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

import Article from './components/Article'
import ArticleWeb from './components/ArticleWeb'
import MiniArticle from './components/MiniArticle'

import HomeScreen from './screens/HomeScreen'
import TagsScreen from './screens/TagsScreen'
import SettingsScreen from './screens/SettingsScreen'

import FilterModal from './modals/FilterModal'

import Icon from 'react-native-vector-icons/FontAwesome'

import {
  StackNavigator,
  TabNavigator
} from 'react-navigation';

const HomeStack = StackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    headerMode: 'none'
  },
  Article: {screen: Article},
  ArticleWeb: {screen: ArticleWeb},
  MiniArticle: {screen: MiniArticle},
  FilterModal: {
    screen: FilterModal,
    mode: 'modal',
  }
}, {
  navigationOptions: {
    initialRouteName: 'HomeScreen',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="home"
        style={{color: tintColor}}
        size={30}
      />
    )
  }
});

const MainTabs = TabNavigator(
  {
    HomeScreen: {screen: HomeStack},
    TagsScreen: {screen: TagsScreen},
    SettingsScreen: {screen: SettingsScreen},
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'lightgrey',
      inactiveTintColor: '#3498db',
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: '#2980b9'
      }
    }
  }
);

export default class app extends Component {
  render(){
    return(
        <View style={styles.container}>
          <MainTabs/>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (Platform.OS === "android"?0:19), //Padding top 19 in case the OS is iOS
    //On Android this padding is already there by default
    backgroundColor: '#fff',
    justifyContent:'flex-start',
    alignItems:'stretch'
  },
});
