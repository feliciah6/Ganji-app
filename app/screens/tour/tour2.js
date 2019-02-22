import React from 'react';
import {
  View,
  Image,
  Dimensions,
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';

export class Tour2 extends React.Component {
  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/ganjiWT2.png') : require('../../assets/images/screensImageDark.png')
  );

  renderImage = () => (
    <Image
      style={{ width: Dimensions.get('window').width }}
      source={this.getThemeImageSource(RkTheme.current)}
    />
  );

  render = () => (
    <View style={styles.screen}>
      {this.renderImage()}
      <RkText rkType='header2' style={styles.text}>Ganji is your digital wallet, asset exchange and investment trust all rolled into one.</RkText>
    </View>
  )
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 30,
  },
}));
