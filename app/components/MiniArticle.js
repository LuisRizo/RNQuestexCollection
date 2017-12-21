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
    return new Date(date.slice(0, date.lastIndexOf('-'))).toDateString();
  }

  render(){
    let {title, author, content, summary, url, image, tags, primaryTaxonomy, date, website} = this.state.article;
    return(
      <TouchableOpacity onPress={this._OpenArticle} style={styles.MainContainer}>
        <View style={styles.TitleRow}>
          <HtmlText style={styles.TitleText} html={title}></HtmlText>
        </View>
        <View style={styles.ImageAndText}>
          <View style={styles.ImageContainer}>
            <Image style={styles.Image} source={this.props.image}/>
          </View>
          <View style={styles.SummaryContainer}>
            <HtmlText numberOfLines={7} style={styles.SummaryText} html={summary}></HtmlText>
          </View>
        </View>
        <View style={styles.ContentSource}>
          <Text style={styles.Source}>{website}, {this.getDate(date)}</Text>
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
    flex:1,
    margin:10,
    padding:10,
    minHeight:220,
    maxHeight: 320,
    alignItems:'stretch',
    flexDirection:'column',
    justifyContent:'center',
    backgroundColor:'lightgrey'
  },
  TitleRow:{
  },
  TitleText:{
    fontWeight:'bold',
    fontSize: 16,
  },
  ImageAndText:{
    flex:1,
    marginTop:5,
    flexDirection:'row',
    alignItems:'stretch',
    alignContent:'stretch',
    justifyContent:'space-between',
    alignSelf:'stretch'
  },
  ImageContainer:{
    flex:1,
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
    flex:1,
    backgroundColor:'black'
  },
  ContentSource:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Source:{
    color:'grey',
    fontSize:12,
  }
})
