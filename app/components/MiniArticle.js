'use strict'
// @flow
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import DataService from '../lib/dataInstance'
import HtmlText from '../lib/HtmlText/HtmlText'
import _ from 'lodash'

type Props = {
  settings: any,
  navigation: any,
  data: any,
  image: any,
}

type State = {
  settings: any,
  article: any,
}

export default class MiniArticle extends Component<Props, State> {
  static navigationOptions = {
    title: 'Welcome',
  }

  constructor(props) {
    super(props)
    this.state = {
      settings: {
        showThumbnail: true,
        textSize: 15,
      },
      article: this.props.data || this.articleJson[0],
    }
  }

  componentDidMount() {
    let settings = this.props.settings
    this.setState({ settings: { ...this.state.settings, ...settings } })
  }

  componentDidUpdate(prevProps, prevState) {
    let settings = this.props.settings
    if (_.isEqual(prevProps.settings, settings)) {
      return
    }
    this.setState({ settings: { ...this.state.settings, ...settings } })
  }

  getDate(date: any) {
    var date = new Date(date.slice(0, date.lastIndexOf('-')))
    date = date.toDateString().split(' ')
    date[2] += ','
    date.shift()
    return date.join(' ')
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    // if (_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state)) {
    //   return false
    // }
    return true
  }

  render() {
    let {
      title,
      author,
      content,
      summary,
      url,
      image,
      tags,
      primaryTaxonomy,
      date,
      website,
    } = this.state.article
    return (
      <TouchableOpacity
        onPress={this._OpenArticle}
        style={styles.MainContainer}>
        <View style={styles.ContentSource}>
          <Text style={styles.SourceDate}>{this.getDate(date)}</Text>
          <Text style={styles.SourceSite}>{website}</Text>
        </View>
        <View style={styles.TitleRow}>
          <HtmlText style={styles.TitleText} html={title} />
        </View>
        <View style={styles.ImageAndText}>
          {settings.showThumbnail == null || settings.showThumbnail === true ? (
            <View style={styles.ImageContainer}>
              <Image style={styles.Image} source={this.props.image} />
            </View>
          ) : (
            <View />
          )}
          <View style={styles.SummaryContainer}>
            <HtmlText
              numberOfLines={8}
              style={[
                styles.SummaryText,
                { fontSize: settings.textSize ? settings.textSize : 15 },
              ]}
              html={summary}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _OpenArticle = data => {
    this.props.navigation.navigate('ArticleWeb', {
      url: this.state.article.url,
      title: this.state.article.title,
    })
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    margin: 10,
    paddingBottom: 15,
    minHeight: 180,
    maxHeight: 320,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    marginBottom: 4,
  },
  TitleRow: {},
  TitleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
  },
  ImageAndText: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  ImageContainer: {
    flexBasis: 'auto',
    marginRight: 5,
    alignSelf: 'stretch',
  },
  SummaryContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  SummaryText: {
    fontWeight: '200',
    fontSize: 15,
  },
  Image: {
    width: 114,
    height: 86,
    marginRight: 4,
  },
  ContentSource: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Source: {
    color: 'grey',
    fontSize: 12,
  },
  SourceDate: {
    color: 'grey',
    fontSize: 12,
  },
  SourceSite: {
    color: 'grey',
    fontSize: 12,
  },
})
