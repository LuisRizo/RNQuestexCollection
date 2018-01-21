// @flow

import { AsyncStorage } from 'react-native'
import _ from 'lodash'

var instance = {
  data: {},
  settings: {},
}

var update = () => {}
// Structure of instance
// {
//   data: {
//     'Luxury Travel Advisor': [
//       {
//         author: 'Newsdesk',
//         content: '<html/>',
//         date: '',
//         id: 131,
//         image: 'https:...',
//         primaryTaxonomy: 'Running your business',
//         summary: 'A new luxury sales...',
//         tags: 'Luxury Travel, Travel Industry Executive',
//         title: 'Signature launches luxury...',
//         type: 'article',
//         url: 'https://',
//         website: 'Travel Agent Central',
//       }
//     ],
//    ...
//   },
//   settings: {
//      ...
//   }
// }
export default class Cache {
  static init(...args: any) {
    return args.map(item => {
      return AsyncStorage.getItem(item)
        .then(response => {
          if (response) {
            instance[item] = JSON.parse(response)
            return instance[item]
          } else {
            let p = {}
            instance[item] = p
            return p
          }
        })
        .catch(err => {
          console.warn(err)
        })
    })
  }

  static get(item: string): any {
    if (instance[item] && Object.keys(instance[item]).length > 0) {
      return instance[item]
    } else {
      if (item) {
        AsyncStorage.getItem(item).then(response => {
          instance[item] = JSON.parse(response)
          return instance[item]
        })
      }
    }
  }

  static setUpdaterFunction(func: any) {
    update = () => func(instance)
  }

  static set(data: any, item: string) {
    console.log('dataService: ', data, item)
    if (data) {
      instance[item] = data
      update()
      return AsyncStorage.setItem(item, JSON.stringify(data))
    }
  }

  static clean(item: string): any {
    if (item) {
      instance[item] = {}
      update()
      return AsyncStorage.setItem(item, JSON.stringify(instance[item]))
    } else {
      instance = {
        data: {},
        settings: {},
      }
      update()
      return AsyncStorage.setItem('data', JSON.stringify(instance.data)).then(
        () => {
          return AsyncStorage.setItem(
            'settings',
            JSON.stringify(instance.settings)
          )
        }
      )
    }
  }
}
