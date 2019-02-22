// required imports
import React from 'react';
import
{
    View,
    ScrollView,
    Image,
    Alert,
    Keyboard,
	BackHandler
} from 'react-native';
import
{
	RkButton,
	RkText,
	RkPicker,    
	RkTextInput,
	RkStyleSheet,
	RkTheme,
	RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/';
import { scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';

// the SignUp class (first part of registration)
export class SignUp extends React.Component
{
	static navigationOptions = {header: null};
	static propTypes = {navigation: NavigationType.isRequired};
	// the constructor
	constructor(props)
	{
		super(props);
		// the state object for SignUp
		this.state = {
			txtName: '',
			txtLogin: '',
			txtPass: '',
			txtPass2: ''
		};
	}
	// method to set image based on theme selection
	getThemeImageSource(theme)
	{
		return theme.name === 'light' ? require('../../assets/images/logo.png') : require('../../assets/images/logoDark.png');
	}
	// render the screen image
	renderImage()
	{
		return ( <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} /> );
	}
	// methods for responding to input
	onTxtNameChanged = (text) => {
		this.setState({ txtName: text });
	};
  
	onTxtLoginChanged = (text) => {
		this.setState({ txtLogin: text });
	};
	
	onTxtPassChanged = (text) => {      
		this.setState({ txtPass: text });
	};
	
	onTxtPass2Changed = (text) => {
		this.setState({ txtPass2: text });
	};
	// method to collect input and carry to next reg screen
	onNextButtonPressed = () =>
	{
		// check fields for validations
		if (this.state.txtName == '' || this.state.txtLogin == '' || this.state.txtPass == '')
		{
			// alert about fields
      Alert.alert('Ganji', 'All fields are mandatory!', [{text: 'OK'}]);
		}
		else if (this.state.txtPass !== this.state.txtPass2)
		{
			// alert about matching passwords
      Alert.alert('Ganji', 'The passwords must match!', [{text: 'OK'}]);
		}
		else
		{
			var formParams = { name: this.state.txtName, login: this.state.txtLogin, pass: this.state.txtPass };
			this.props.navigation.navigate('Register', formParams);
		}
	};
	// method to go back to login screen
	onLoginButtonPressed = () =>
	{
		this.props.navigation.navigate('Login');
	};
	// method that runs when screen loads
	componentDidMount()
	{
		// runs before render()
		// ensure we do not go to register if we are already logged in
		if (global.client != null)
		{
		  // go back where we came from
		  this.props.navigation.goBack();
		}
		// remove any previous handler
		BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }
	// method to render the screen
	render = () => (
		<ScrollView keyboardShouldPersistTaps='always'>
			<RkAvoidKeyboard style={styles.screen} onStartShouldSetResponder={() => true} onResponderRelease={() => Keyboard.dismiss()}>
				<View style={{ alignItems: 'center' }}>
					{this.renderImage()}
					<RkText rkType='h1'>Registration</RkText>
				</View>
				<View style={styles.content}>
					<View>
						<RkTextInput rkType='rounded' placeholder='Name' onChangeText={this.onTxtNameChanged} />
						<RkTextInput rkType='rounded' placeholder='Login' onChangeText={this.onTxtLoginChanged} />
						<RkTextInput rkType='rounded' placeholder='Password' onChangeText={this.onTxtPassChanged} secureTextEntry />
						<RkTextInput rkType='rounded' placeholder='Confirm Password' onChangeText={this.onTxtPass2Changed} secureTextEntry />
						<GradientButton style={styles.save} rkType='large' text='NEXT' onPress={this.onNextButtonPressed} />
					</View>
					<View style={styles.footer}>
						<View style={styles.textRow}>
							<RkText rkType='primary3'>Already have an account?</RkText>
							<RkButton rkType='clear' onPress={this.onLoginButtonPressed}>
								<RkText rkType='header6'> Sign in now</RkText>
							</RkButton>
						</View>
					</View>
				</View>
			</RkAvoidKeyboard>
		</ScrollView>
	)
} // class SignUp ends

// definition of styles
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
