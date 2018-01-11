import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class TagsScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    let { params = {} } = navigation.state;

    return {
      tabBarLabel: "Tags",
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="tags"
          style={{color: tintColor}}
          size={30}
        />
      ),
    };
  }

  render() {
    return (
      <View>
        <Text>
          This is the tags screen
        </Text>
      </View>
    )
  }
}
