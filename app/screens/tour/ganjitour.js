import React from 'react';
import
{
  View,
  Alert,
} from 'react-native';
import { RkStyleSheet } from 'react-native-ui-kitten';
import {
  GradientButton,
  PaginationIndicator,
} from '../../components/';
import { Tour } from '../../components/tour';
import { Tour1 } from './tour1';
import { Tour2 } from './tour2';
import NavigationType from '../../config/navigation/propTypes';
import base64 from 'base-64';

export class GanjiTour extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    header: null,
  };

  state = {
    index: 0,
  };

  onWalkThroughIndexChanged = (index) => {
    this.setState({ index });
  };

  onStartButtonPressed = () => {
    // update client to remove splash
    var login = global.client[2];
    // make the call to the API
		return fetch('http://162.144.151.204:9432/ganji/clients/update',
			{
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + base64.encode('maxim:guap18')
			  },
			  body: JSON.stringify({login: login, purpose: 'splash', splash: false}),
			}
		)
		.then((response) => response.json())
		.then((responseJson) =>
    {
			if (responseJson.kikapu.Error === false)
			{
          // go to landing
          Alert.alert('Ganji', 'You can get this tour again from the Help menu', [{text: 'OK'}]);
          // go to landing
          this.props.navigation.navigate('Landing');
			}
      else
      {
        Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
        // go to landing
        this.props.navigation.navigate('Landing');
      }
		})
		.catch((error) => {
			console.error(error);
      Alert.alert('Ganji', error, [{text: 'OK'}]);
      // go to landing
      this.props.navigation.navigate('Landing');
		});
  };

  render = () => (
    <View style={styles.screen}>
      <Tour onChanged={this.onWalkThroughIndexChanged}>
        <Tour1 />
        <Tour2 />
      </Tour>
      <PaginationIndicator length={2} current={this.state.index} />
      <GradientButton
        rkType='large'
        style={styles.button}
        text="GET STARTED"
        onPress={this.onStartButtonPressed}
      />
    </View>
  )
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base,
    paddingVertical: 28,
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
  },
}));
