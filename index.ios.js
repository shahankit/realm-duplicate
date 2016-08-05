/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Realm from 'realm';

class User {}
User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    interests: { type: 'list', objectType: 'Interest', default: [] },
  }
}

class Interest {}
Interest.schema = {
  name: 'Interest',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '' },
    name: { type: 'string', default: '' },
    interestedUsers: { type: 'list', objectType: 'User', default: [] },
  }
}

const realm = new Realm({
  schema: [User, Interest],
  schemaVersion: 1,
  migration: () => {}
});

class RealmDuplicate extends Component {
  addNormal() {
    const user = {
      id: '1',
      name: 'John',
      interests: [{
        id: '1',
        name: 'Interest1',
        interestedUsers: [{
          id: '1',
          name: 'John'
        }, {
          id: '3',
          name: 'Jane'
        }]
      }, {
        id: '2',
        name: 'Interest2',
        interestedUsers: [{
          id: '1',
          name: 'John'
        }]
      }, {
        id: '3',
        name: 'Interest3',
        interestedUsers: [{
          id: '2',
          name: 'Jimmy'
        }, {
          id: '3',
          name: 'Jane'
        }]
      }]
    };
    realm.write(() => {
      realm.create('User', user, true);
    });
  }

  addCyclic() {
    const user = {
      id: '1',
      name: 'John',
      interests: [{
        id: '1',
        name: 'Interest1',
        interestedUsers: [{
          id: '1',
          name: 'John',
          interests: [{
            id: '1'
          }, {
            id: '2'
          }, {
            id: '3'
          }]
        }, {
          id: '3',
          name: 'Jane',
          interests: [{
            id: '1'
          }, {
            id: '3'
          }]
        }]
      }, {
        id: '2',
        name: 'Interest2',
        interestedUsers: [{
          id: '1',
          name: 'John',
          interests: [{
            id: '1'
          }, {
            id: '2'
          }, {
            id: '3'
          }]
        }]
      }, {
        id: '3',
        name: 'Interest3',
        interestedUsers: [{
          id: '2',
          name: 'Jimmy',
          interests: [{
            id: '3'
          }]
        }, {
          id: '3',
          name: 'Jane',
          interests: [{
            id: '1'
          }, {
            id: '3'
          }]
        }]
      }]
    };
    realm.write(() => {
      realm.create('User', user, true);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.addNormal}
        >
          <Text style={styles.buttonLabel}>Add Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.addCyclic}
        >
          <Text style={styles.buttonLabel}>Add Cyclic</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#0ABFF1'
  },
  buttonLabel: {
    fontSize: 15,
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('RealmDuplicate', () => RealmDuplicate);
