// required imports
import React from 'react';
import
{
	View,
	ScrollView,
	Image,
	Alert,
	Keyboard,
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
import md5 from 'md5';
import base64 from 'base-64';
import Icon from 'react-native-ionicons';
import SearchableDropdown from 'react-native-searchable-dropdown';

// the Register class (second part of registration)
export class Register extends React.Component
{
	static navigationOptions = {header: null,};
	static propTypes = {navigation: NavigationType.isRequired,};
	// the constructor
	constructor(props)
	{
		super(props);
		// get the field values from the previous screen
		const name = this.props.navigation.getParam('name', undefined);
		const login = this.props.navigation.getParam('login', undefined);
		const pass = this.props.navigation.getParam('pass', undefined);
		const pass_safe = md5(pass);
		// the state object for Register
		this.state = {
			name: name,
			login: login,
			password: pass_safe,
			phone: '',
			email: '',
			currency: '',
			lang: '',
			country: ''
		};
	}
	// method to set image based on theme selection
	getThemeImageSource = (theme) => (
		theme.name === 'light' ?
		require('../../assets/images/logo.png') : require('../../assets/images/logoDark.png')
	);
	// render the screen image
	renderImage = () => (
		<Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
	);
	// methods for responding to input
	onTxtPhoneChanged = (text) => {
		this.setState({ phone: text });
	};
	
	onTxtEmailChanged = (text) => {
		this.setState({ email: text });
	};
  
	onTxtCountryChanged = (text) => {
		this.setState({ country: text });
	};
  
	onTxtCurrencyChanged = (text) => {
		this.setState({ currency: text });
	};
  
	onTxtLangChanged = (text) => {
		this.setState({ lang: text });
	};
	// method to process registration
	onRegisterButtonPressed = () =>
	{
		// check fields for validations
		if (this.state.phone == '' || this.state.email == '' || this.state.currency == '' || this.state.lang == '' || this.state.country == '')
		{
			// alert about fields
			Alert.alert('Ganji', 'All fields are mandatory!', [{text: 'OK'}, ],);
		}
		else
		{
			// make the call to the API
			return fetch('http://162.144.151.204:9432/ganji/clients/registration',
			{
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': 'Basic ' + base64.encode('maxim:guap18')
				},
				body: JSON.stringify(this.state),
			})
			.then((response) => response.json())
			.then((responseJson) =>
			{
				Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
				if (responseJson.kikapu.Error === false)
				{
					this.props.navigation.navigate('Login');
				}
			})
			.catch((error) =>
			{
				console.error(error);
				Alert.alert('Ganji', error, [{text: 'OK'}]);
			});
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
    }
	// method to render the screen
	render = () => (
		<ScrollView keyboardShouldPersistTaps='always'>
			<RkAvoidKeyboard style={styles.screen} onStartShouldSetResponder={() => true} onResponderRelease={() => Keyboard.dismiss()}>
				<View style={{ alignItems: 'center' }}>
					{this.renderImage()}
					<RkText rkType='h1'>Profile Details</RkText>
				</View>
				<View style={styles.content}>
					<View>
						<RkTextInput rkType='rounded' placeholder='Phone' onChangeText={this.onTxtPhoneChanged}/>
						<RkTextInput rkType='rounded' placeholder='Email' onChangeText={this.onTxtEmailChanged}/>
						<SearchableDropdown rkType='rounded' onItemSelect={item => this.onTxtCurrencyChanged(item.id)} 
							containerStyle={{padding: 5}}
							textInputStyle={{
							  padding: 12,
							  borderWidth: 1,
							  borderColor: '#ccc',
							  borderRadius: 5
							}}
							itemStyle={{
							  padding: 10,
								marginTop: 2,
							  backgroundColor: '#ddd',
							  borderColor: '#bbb',
							  borderWidth: 1,
							  borderRadius:5
							}}
							itemTextStyle={{
							color: '#222'
							}}
							itemsContainerStyle={{
							  maxHeight: 140
							}}
							items={global.assetList}
							placeholder="Please pick a currency"
							resetValue={false}
							underlineColorAndroid='transparent' />
				  <SearchableDropdown
					rkType='rounded'
					onItemSelect={item => this.onTxtLangChanged(item.id)}
					containerStyle={{
					  padding: 5
					}}
					textInputStyle={{
					  padding: 12,
					  borderWidth: 1,
					  borderColor: '#ccc',
					  borderRadius: 5
					}}
					itemStyle={{
					  padding: 10,
						marginTop: 2,
					  backgroundColor: '#ddd',
					  borderColor: '#bbb',
					  borderWidth: 1,
					  borderRadius:5
					}}
					itemTextStyle={{
					color: '#222'
					}}
					itemsContainerStyle={{
					  maxHeight: 140
					}}
					items={global.langList}
					placeholder="Please pick a language"
					resetValue={false}
					underlineColorAndroid='transparent' />
				  <SearchableDropdown
					rkType='rounded'
					onItemSelect={item => this.onTxtCountryChanged(item.id)}
					containerStyle={{
					  padding: 5
					}}
					textInputStyle={{
					  padding: 12,
					  borderWidth: 1,
					  borderColor: '#ccc',
					  borderRadius: 5
					}}
					itemStyle={{
					  padding: 10,
						marginTop: 2,
					  backgroundColor: '#ddd',
					  borderColor: '#bbb',
					  borderWidth: 1,
					  borderRadius:5
					}}
					itemTextStyle={{
					color: '#222'
					}}
					itemsContainerStyle={{
					  maxHeight: 140
					}}
					items={global.countryList}
					placeholder="Please pick a country"
					resetValue={false}
					underlineColorAndroid='transparent' />  
				  <GradientButton
					style={styles.save}
					rkType='large'
					text='REGISTER'
					onPress={this.onRegisterButtonPressed}
				  />
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
