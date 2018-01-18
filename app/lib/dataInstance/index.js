// @flow

import { AsyncStorage } from 'react-native'
import _ from 'lodash'

var instance = null

// Structure of instance
// {
//   'Luxury Travel Advisor': [
//     {
//       author: 'Newsdesk',
//       content: '<html/>',
//       date: '',
//       id: 131,
//       image: 'https:...',
//       primaryTaxonomy: 'Running your business',
//       summary: 'A new luxury sales...',
//       tags: 'Luxury Travel, Travel Industry Executive',
//       title: 'Signature launches luxury...',
//       type: 'article',
//       url: 'https://',
//       website: 'Travel Agent Central',
//     }
//   ],
// }

export default class Cache {
  static init() {
    console.log(instance)
    return AsyncStorage.getItem('data').then(data => {
      if (data) {
        instance = JSON.parse(data)
        console.log(instance)

        return instance
      } else {
        let p = {}
        instance = p
        return p
      }
    })
  }

  static get(): any {
    if (instance) {
      return instance
    } else {
      AsyncStorage.getItem('data').then(data => {
        instance = JSON.parse(data)
        return instance
      })
    }
  }

  static set(data: any) {
    console.log('dataService: ', data)
    if (data) {
      instance = data
      return AsyncStorage.setItem('data', JSON.stringify(data))
    }
  }

  static clean(): any {
    instance = {}
    return AsyncStorage.setItem('data', JSON.stringify(instance))
  }
}
