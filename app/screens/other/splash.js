import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Alert,
  Dimensions,
  StatusBar,
  NetInfo,
  BackHandler,
} from 'react-native';
import {
  RkText,
  RkTheme,
} from 'react-native-ui-kitten';
import {
  StackActions,
  NavigationActions,
} from 'react-navigation';
import { ProgressBar } from '../../components';
import { KittenTheme } from '../../config/theme';
import { scale, scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import base64 from 'base-64';

const delay = 500;

export class SplashScreen extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  state = {
    progress: 0,
  };

  componentDidMount() {
    // add handler for back button to exit
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    StatusBar.setHidden(true, 'none');
    // create the global client variable
    global.client = null;
    RkTheme.setTheme(KittenTheme);
    // check internet connection
    NetInfo.isConnected.fetch()
    .then(isConnected =>
    {
      if(!isConnected)
      {
        // you need internet
        Alert.alert('Ganji', 'There is no internet connection!', [{text: 'OK'}]);
        // exit
        BackHandler.exitApp();
      }
    });

		// fetch data for dropdowns
		// assets =======================================================
		fetch('http://162.144.151.204:9432/ganji/assets/list',
			{
				method: 'GET',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': 'Basic ' + base64.encode('maxim:guap18')
				},
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.kikapu.Error === false)
			{
				// get the assets list
				var assetRaw = responseJson.kikapu.Data;
				var assetList = [];
				// create a list of dict objects
				for (i = 0; i < assetRaw.length; i++)
				{
					// create the object and add to the list
					var a = {name: assetRaw[i][1], id: assetRaw[i][0], desc: assetRaw[i][2], dbid: assetRaw[i][3]};
					assetList.push(a);
				}
				global.assetList = assetList;
			}
			else
			{
				global.assetList = [];
				Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
			}
		})
		.catch((error) => {
			console.error(error);
			Alert.alert('Ganji', error, [{text: 'OK'}]);
			global.assetList = [];
		});
		// languages =======================================================
		fetch('http://162.144.151.204:9432/ganji/languages/list',
			{
				method: 'GET',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': 'Basic ' + base64.encode('maxim:guap18')
				},
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.kikapu.Error === false)
			{
				// get the languages list
				var langRaw = responseJson.kikapu.Data;
				var langList = [];
				// create a list of dict objects
				for (i = 0; i < langRaw.length; i++)
				{
					// create the object and add to the list
					var l = {name: langRaw[i][1], id: langRaw[i][0], dbid: langRaw[i][2]};
					langList.push(l);
				}
				global.langList = langList;
			}
			else
			{
				global.langList = [];
				Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
			}
		})
		.catch((error) => {
			console.error(error);
			Alert.alert('Ganji', error, [{text: 'OK'}]);
			global.langList = [];
		});
		// countries =======================================================
		fetch('http://162.144.151.204:9432/ganji/countries/list',
			{
				method: 'GET',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': 'Basic ' + base64.encode('maxim:guap18')
				},
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.kikapu.Error === false)
			{
				// get the countries list
				var countryRaw = responseJson.kikapu.Data;
				var countryList = [];
				// create a list of dict objects
				for (i = 0; i < countryRaw.length; i++)
				{
					// create the object and add to the list
					var c = {name: countryRaw[i][1], id: countryRaw[i][0], dc: countryRaw[i][2], dbid: countryRaw[i][4]};
					countryList.push(c);
				}
				global.countryList = countryList;
			}
			else
			{
				global.countryList = [];
				Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
			}
		})
		.catch((error) => {
			console.error(error);
			Alert.alert('Ganji', error, [{text: 'OK'}]);
			global.countryList = [];
		});
    this.timer = setInterval(this.updateProgress, delay);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  
  backPressed = () => {
    Alert.alert('Ganji', 'Exit Ganji', 'Do you want to exit?', [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ], { cancelable: false });
      return true;
  }

  updateProgress = () => {
    if (this.state.progress === 1) {
      clearInterval(this.timer);
      setTimeout(this.onLoaded, delay);
    } else {
      const randProgress = this.state.progress + (Math.random() * 0.5);
      this.setState({ progress: randProgress > 1 ? 1 : randProgress });
    }
  };

  onLoaded = () => {
    StatusBar.setHidden(false, 'slide');
    const toHome = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    this.props.navigation.dispatch(toHome);
  };

  render = () => (
    <View style={styles.container}>
      <View>
        <Image
          style={[styles.image, { width: Dimensions.get('window').width }]}
          source={require('../../assets/images/splashBack.png')}
        />
        <View style={styles.text}>
          <RkText rkType='logo' style={styles.appName}>Ganji</RkText>
          <RkText rkType='light' style={styles.hero}>Transfer | Exchange | Invest</RkText>
        </View>
      </View>
      <ProgressBar
        color={RkTheme.current.colors.accent}
        style={styles.progress}
        progress={this.state.progress}
        width={scale(320)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    resizeMode: 'cover',
    height: scaleVertical(430),
  },
  text: {
    alignItems: 'center',
  },
  hero: {
    fontSize: 25,
  },
  appName: {
    fontSize: 62,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    backgroundColor: '#e5e5e5',
  },
});
