import React, {Component} from 'react';
import { Text, View, StyleSheet, WebView } from 'react-native';

export default class ArticleWeb extends Component {
  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state;
    this.state = {
      url: params.url || "http://travelagentcentral.com"
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title
  });

  render(){
    return(
        <View style={styles.container}>
          <WebView
            source={{uri: this.state.url}}
            style={{marginTop: 20}}
          />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'flex-start',
    alignItems:'stretch'
  },
});
