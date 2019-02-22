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

export class Logout extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
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
  
  componentDidMount()
  {
    // remove any previous handler
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    // remove all major variables
    global.client = undefined;
    global.clientBalance = undefined;
    global.clientTx = undefined;
    // go back to login
    this.props.navigation.navigate('Login');
  }
  
  render = () => (
    <RkAvoidKeyboard
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}
      style={styles.screen}>
      {this.renderImage()}
      <View style={styles.container}>
        <RkText rkType='header5'>Logging out...</RkText>
      </View>
    </RkAvoidKeyboard>
  );
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
