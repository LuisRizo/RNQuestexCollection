// @flow
import React from 'react'
import { Dimensions, Platform } from 'react-native'
import _ from 'lodash'
import moment from 'moment-timezone'

import DataService from '../dataInstance'

export const mixWebsites = (obj: any): array => {
  var finalArray = []
  if (obj === undefined) {
    obj = DataService.get('data')
  }
  for (var v in obj) {
    if (obj.hasOwnProperty(v)) {
      finalArray = _.union(finalArray, obj[v])
    }
  }
  return finalArray
}

export const makeUrlHttps = (url: string): string => {
  if (url.split(':')[0] === 'http') {
    return 'https:' + url.split(':')[1]
  }
  return url
}

export const sortByDate = (array: array): array => {
  return array.sort(function(a, b) {
    //The default constructor of date (Date(a.date)) only works on Debug mode
    //This caused the real device to display articles in random orders.
    //https://github.com/facebook/react-native/issues/13195
    // a = moment(a.date)
    // b = moment(b.date)
    a = new Date(a.date.slice(0, a.date.lastIndexOf('-')))
    b = new Date(b.date.slice(0, b.date.lastIndexOf('-')))
    return a > b ? -1 : a < b ? 1 : 0
  })
}
