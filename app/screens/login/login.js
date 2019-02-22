import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Alert,
  NetInfo,
  BackHandler,
  Dimensions,
  Keyboard,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scaleModerate, scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import { clientbalances } from '../../data/api/clientbalances';
import { clienttransactions } from '../../data/api/clienttransactions';
import { setupAPNSystem } from '../../data/listeners/notifications';
import md5 from 'md5';
import base64 from 'base-64';
import {NotificationsAndroid, PendingNotifications} from 'react-native-notifications';

export class Login extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
    // create the state
    this.state = {
      login: '',
      password: ''
    };
  }
  
  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/backgroundLogin.png') : require('../../assets/images/backgroundLoginDarkTheme.png')
  );

  renderImage = () => {
    const screenSize = Dimensions.get('window');
    const imageSize = {
      width: screenSize.width,
      height: screenSize.height - scaleModerate(375, 1),
    };
    return (
      <Image
        style={[styles.image, imageSize]}
        source={this.getThemeImageSource(RkTheme.current)}
      />
    );
  };

  onLoginButtonPressed = () => {
    // check fields for validations
    if (this.state.login == '' || this.state.password == '')
    {
      // alert about fields
      Alert.alert('Ganji', 'All fields are mandatory!', [{text: 'OK'}]);
    }
    else
    {
		// hash the password first
		var pass_hash = md5(this.state.password);
		// get the login
		var login = this.state.login;
		// make the call to the API
		return fetch('http://162.144.151.204:9432/ganji/clients/login',
			{
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + base64.encode('maxim:guap18')
			  },
			  body: JSON.stringify({login: login, password: pass_hash}),
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.kikapu.Error === false)
			{
        // save the client object
        global.client = responseJson.kikapu.Data;
        // get balances
        clientbalances();
        clienttransactions();
        // check if this is first login
        if (global.client[16] == true)
        {
          // show the walkthrough
          this.props.navigation.navigate('GanjiTour');
        }
        else
        {
          // test notification; remove in production
          NotificationsAndroid.localNotification({
            title: "Ganji",
            body: "Welcome to Ganji",
            extra: "data"
          });
          // go to landing
          this.props.navigation.navigate('Landing');
        }
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

  onSignUpButtonPressed = () => {
    this.props.navigation.navigate('SignUp');
  };
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  
  componentDidMount()
  {
    // remove any previous handler
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    // add handler for back button to exit
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    // setup notifications
    setupAPNSystem();
  }
  
  backPressed = () => {
    Alert.alert('Exit Ganji', 'Do you want to exit Ganji?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ],
      { cancelable: false });
      return true;
  }
  
  render = () => {
    // ensure we do not go to login if we are already logged in
    if (global.client != null)
    {
      // go back where we came from
      return null;
      this.props.navigation.goBack();
    }
    else
    {
      return (
        <ScrollView keyboardShouldPersistTaps='always'>
          <RkAvoidKeyboard
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => Keyboard.dismiss()}
            style={styles.screen}>
            {this.renderImage()}
            <View style={styles.container}>
              <View style={styles.buttons}>
                <RkButton style={styles.button} rkType='social'>
                  <RkText rkType='awesome hero accentColor'>{FontAwesome.twitter}</RkText>
                </RkButton>
                <RkButton style={styles.button} rkType='social'>
                  <RkText rkType='awesome hero accentColor'>{FontAwesome.google}</RkText>
                </RkButton>
                <RkButton style={styles.button} rkType='social'>
                  <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
                </RkButton>
              </View>
              <RkTextInput rkType='rounded' placeholder='Username' onChangeText={(login) => this.setState({login})}/>
              <RkTextInput rkType='rounded' placeholder='Password' onChangeText={(password) => this.setState({password})} secureTextEntry />
              <GradientButton
                style={styles.save}
                rkType='large'
                onPress={this.onLoginButtonPressed}
                text='LOGIN'
              />
              <View style={styles.footer}>
                <View style={styles.textRow}>
                  <RkText rkType='primary3'>Don’t have an account?</RkText>
                  <RkButton rkType='clear'>
                    <RkText rkType='header6' onPress={this.onSignUpButtonPressed}> Sign up now</RkText>
                  </RkButton>
                </View>
              </View>
            </View>
          </RkAvoidKeyboard>
        </ScrollView>
      );
    }
    }
  }

const styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1,
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
  },
  button: {
    marginHorizontal: 14,
  },
  save: {
    marginVertical: 9,
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));
