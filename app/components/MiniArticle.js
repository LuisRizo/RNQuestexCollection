'use strict';

import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import articleJson from '../data/SampleArticle.json'

import HtmlText from '../lib/HtmlText/HtmlText'

export default class MiniArticle extends Component {
  static navigationOptions = {
    title: 'Welcome'
  };

  constructor(props){
    super(props);
    this.state = {
      article: this.props.data || this.articleJson[0]
    }
  }

  getDate(date){
    var date = new Date(date.slice(0, date.lastIndexOf('-')))
    date = date.toDateString().split(' ')
    date[2] += ','
    date.shift();
    return date.join(' ');
  }

  render(){
    let {title, author, content, summary, url, image, tags, primaryTaxonomy, date, website} = this.state.article;
    return(
      <TouchableOpacity onPress={this._OpenArticle} style={styles.MainContainer}>
      <View style={styles.ContentSource}>
            <Text style={styles.SourceDate}>
              {this.getDate(date)} 
            </Text>
            <Text style={styles.SourceSite}>
              {website}
            </Text>
          </View>
        <View style={styles.TitleRow}>
          <HtmlText style={styles.TitleText} html={title}/>
        </View>
        <View style={styles.ImageAndText}>
          <View style={styles.ImageContainer}>
            <Image style={styles.Image} source={this.props.image}/>
          </View>
          <View style={styles.SummaryContainer}>
            <HtmlText numberOfLines={8} style={styles.SummaryText} html={summary}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _OpenArticle = data => {
    this.props.navigation.navigate('ArticleWeb', {url: this.state.article.url, title: this.state.article.title});
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    margin:10,
    paddingBottom: 15,
    minHeight:180,
    maxHeight: 320,
    alignItems:'stretch',
    justifyContent:'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    marginBottom:4
  },
  TitleRow:{
  },
  TitleText:{
    fontWeight:'bold',
    fontSize: 16,
    marginTop: 6
  },
  ImageAndText:{
    marginTop:5,
    flexDirection:'row',
    alignItems:'stretch',
    alignContent:'stretch',
    justifyContent:'space-between',
    alignSelf:'stretch'
  },
  ImageContainer:{
    flexBasis:'auto',
    marginRight:5,
    alignSelf:'stretch',
  },
  SummaryContainer:{
    flex:1,
    alignSelf:'stretch',
  },
  SummaryText:{
    fontWeight: "200",
    fontSize: 15
  },
  Image:{
    width:114,
    height:86,
    marginRight:4
  },
  ContentSource:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  SourceDate:{
    color:'grey',
    fontSize:12,
  },
  SourceSite:{
    color:'grey',
    fontSize:12
  }
})
