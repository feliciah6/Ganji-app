import React from 'react';
import {
  View,
  Image,
  Keyboard,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/';
import { scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import Icon from 'react-native-ionicons';
import base64 from 'base-64';
import QRCodeScanner from 'react-native-qrcode-scanner';

export class Deposit extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  
  constructor(props) {
    super(props);
	// get the field values from the previous screen
    const login = this.props.navigation.getParam('login', undefined);
    // create the values for the form
    this.state = {
		login: login,
		txid: ''
    };
  }
  
  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/logo.png') : require('../../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onDepositButtonPressed = () => {
    // check fields for validations
    if (this.state.txid == '')
    {
      // alert about fields
      alert('You must enter a voucher code ' + global.client[2] + '!');
    }
    else
    {
      // make the call to the API
      return fetch('http://162.144.151.204:9432/ganji/assets/vouchers/deposit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode('maxim:guap18')
          },
          body: JSON.stringify(this.state),
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        alert(responseJson.kikapu.ResultDesc);
        if (responseJson.kikapu.Error === false)
        {
          this.props.navigation.navigate('Wallet');
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
    }
  };

  onCancelButtonPressed = () => {
    this.props.navigation.navigate('Wallet');
  };

  render = () => (
    <RkAvoidKeyboard
      style={styles.screen}
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}>
      <View style={{ alignItems: 'center' }}>
        {this.renderImage()}
        <RkText rkType='h1'>Deposit Voucher</RkText>
      </View>
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <RkText rkType='header6'>Scan the Ganji voucher to get the code</RkText>
        }
        bottomContent={
          <RkText rkType='header6'>Click on SUBMIT once you have the code</RkText>
        }
      />
      <View style={styles.content}>
        <View>
          <RkTextInput rkType='rounded' placeholder='Voucher Code' onChangeText={(txid) => this.setState({txid})}/>
          <GradientButton
            style={styles.save}
            rkType='large'
            text='SUBMIT'
            onPress={this.onDepositButtonPressed}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkButton rkType='clear' onPress={this.onCancelButtonPressed}>
              <RkText rkType='header6'>Go back to my wallet</RkText>
            </RkButton>
          </View>
        </View>
      </View>
    </RkAvoidKeyboard>
  )
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));
