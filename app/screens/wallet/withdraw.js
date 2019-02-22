import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
} from 'react-native-ui-kitten';
import { Avatar } from '../../components';
import { FontAwesome } from '../../assets/icons';
import NavigationType from '../../config/navigation/propTypes';
import { clientbalances } from '../../data/api/clientbalances';

export class Withdraw extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Request a Withdrawal'.toUpperCase(),
  };
  
  render = () => (
    <RkText rkType='header5'>Withdraw</RkText>
  );
}