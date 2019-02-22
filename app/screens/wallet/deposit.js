import React from 'react';
import {
  View,
  Image,
  Keyboard,
  Alert,
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
    // get the login from the global
    const login = global.client[2];
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
  
  onSuccess(scanned)
  {
      // set data to textbox
      this.state.txid = scanned.data;
      Alert.alert('Ganji', 'Voucher code captured, click on SUBMIT to continue', [{text: 'OK'}]);
      // reactivate
      //this.scanner.reactivate();
  }
  
  onDepositButtonPressed = () => {
    // check fields for validations
    if (this.state.txid == '')
    {
      // alert about fields
      Alert.alert('Ganji', 'You must enter a voucher code ' + global.client[2] + '!', [{text: 'OK'}]);
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
        if (responseJson.kikapu.Error === false)
        {
          Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
          this.props.navigation.navigate('WalletMenu');
        }
        else
        {
          Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Ganji', error, [{text: 'OK'}]);
      });
    }
  };

  onCancelButtonPressed = () => {
    this.props.navigation.navigate('WalletMenu');
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
      <View>
        <QRCodeScanner
            ref={(node) => { this.scanner = node }}
            showMarker={true}
            vibrate={false}
            reactivateTimeout={5}
            onRead={this.onSuccess.bind(this)}
            cameraProps={{ captureAudio: false }}
            topContent={
              <RkText rkType='header6'>Scan the Ganji voucher to get the code</RkText>
            }
            bottomContent={
              <RkText rkType='header6'>Click on SUBMIT once you have the code</RkText>
            }
        />
      </View>
      <View style={styles.content}>
        <View>
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
