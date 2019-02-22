import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  NetInfo,
} from 'react-native';
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { data } from '../../data';
import {
  Avatar,
  SocialSetting,
  GradientButton,
} from '../../components';
import { FontAwesome } from '../../assets/icons';
import ImagePicker from 'react-native-image-picker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import base64 from 'base-64';

const options = {
    title: 'Select Avatar',
    customButtons: [],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

export class ProfileSettings extends React.Component {
  static navigationOptions = {
    title: 'Profile Settings'.toUpperCase(),
  };

  state = {
    name: global.client[1],
    login: global.client[2],
    password: global.client[6],
    email: global.client[3],
    country: '',
    phone: global.client[5],
    currency: '',
    lang: '',
    photo: global.client[15]
  };
  
  //photo: 
  
  onNameInputChanged = (text) => {
    this.setState({ firstName: text });
  };

  onLoginInputChanged = (text) => {
    this.setState({ lastName: text });
  };

  onEmailInputChanged = (text) => {
    this.setState({ email: text });
  };

  onCountryInputChanged = (text) => {
    this.setState({ country: text });
  };

  onPhoneInputChanged = (text) => {
    this.setState({ phone: text });
  };

  onCurrencyInputChanged = (text) => {
    this.setState({ currency: text });
  };

  onLangInputChanged = (text) => {
    this.setState({ lang: text });
  };
  
  onAvatarButtonPressed = () => {
    // create an ImagePicker
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel)
      {
        console.log('User cancelled image picker');
      }
      else if (response.error)
      {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton)
      {
        console.log('User tapped custom button: ', response.customButton);
      }
      else
      {
        const source = { uri: response.uri };
        // get the login
        var login = global.client[2];
        var saveData = 'data:image/jpeg;base64,' + response.data;
        this.setState({photo: source,});
        // save to database
        // make the call to the API
        return fetch('http://162.144.151.204:9432/ganji/clients/update',
          {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode('maxim:guap18')
            },
            body: JSON.stringify({purpose: 'photo', login: login, photo: base64.encode(saveData)}),
          }
        )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.kikapu.Error === false)
          {
            // simple say we were successful
            Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
          }
          else
          {
            // say something went wrong
            Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
          }
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Ganji', error, [{text: 'OK'}]);
        });
      }
    });
  }
  
  onUpdateDetailsButtonPressed = () => {
    // check if the values are all present
    if (this.state.name == '' || this.state.login == '' || this.state.email == '' || this.state.phone == '') 
    {
      // alert about fields
      alert('All fields are mandatory!');
    }
    else if (this.state.country == '' || this.state.currency == '' || this.state.lang == '')
    {
      // alert about fields
      alert('All fields are mandatory!');
    }
    else
    {
      // update the client
      
    }
  }

  render = () => (
    <ScrollView style={styles.root}>
      <RkAvoidKeyboard>
        <View style={styles.header}>
          <Avatar img={this.state.photo} rkType='big' />
          <GradientButton rkType='small' style={styles.button} text='CHANGE PHOTO' onPress={this.onAvatarButtonPressed}/>
        </View>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='header6 primary'>USER INFORMATION</RkText>
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Name'
              value={this.state.name}
              rkType='right clear'
              onChangeText={this.onNameInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Login'
              value={this.state.login}
              onChangeText={this.onLoginInputChanged}
              rkType='right clear'
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Email'
              value={this.state.email}
              onChangeText={this.onEmailInputChanged}
              rkType='right clear'
            />
          </View>
          <View style={styles.row}>
            <SearchableDropdown
              rkType='right clear'
              onItemSelect={this.onCountryInputChanged}
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
              placeholder={this.state.country}
              resetValue={false}
              underlineColorAndroid='transparent' />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Phone'
              value={this.state.phone}
              onChangeText={this.onPhoneInputChanged}
              rkType='right clear'
            />
          </View>
          <View style={styles.row}>
            <SearchableDropdown
              rkType='right clear'
              onItemSelect={this.onCurrencyInputChanged}
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
              items={global.assetList}
              placeholder={this.state.currency}
              resetValue={false}
              underlineColorAndroid='transparent' />
          </View>
          <View style={styles.row}>
            <SearchableDropdown
                rkType='right clear'
                onItemSelect={this.onLangInputChanged}
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
            placeholder={this.state.lang}
            resetValue={false}
            underlineColorAndroid='transparent' />
          </View>
        </View>
        <GradientButton rkType='large' style={styles.button} text='SAVE DETAILS' onPress={this.onUpdateDetailsButtonPressed}/>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>CHANGE PASSWORD</RkText>
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Old Password'
              value={this.state.password}
              rkType='right clear'
              secureTextEntry
              onChangeText={this.onPasswordInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='New Password'
              value={this.state.newPassword}
              rkType='right clear'
              secureTextEntry
              onChangeText={this.onNewPasswordInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label='Confirm Password'
              value={this.state.confirmPassword}
              rkType='right clear'
              secureTextEntry
              onChangeText={this.onConfirmPasswordInputChanged}
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>CONNECT SOCIAL MEDIA</RkText>
          </View>
          <View style={styles.row}>
            <SocialSetting name='Twitter' icon={FontAwesome.twitter} tintColor={RkTheme.current.colors.twitter} />
          </View>
          <View style={styles.row}>
            <SocialSetting name='Google' icon={FontAwesome.google} tintColor={RkTheme.current.colors.google} />
          </View>
          <View style={styles.row}>
            <SocialSetting name='Facebook' icon={FontAwesome.facebook} tintColor={RkTheme.current.colors.facebook} />
          </View>
        </View>
        <GradientButton rkType='large' style={styles.button} text='SAVE' />
      </RkAvoidKeyboard>
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25,
  },
  section: {
    marginVertical: 25,
  },
  heading: {
    paddingBottom: 12.5,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
}));
