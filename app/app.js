import React from 'react';
import { View, AppRegistry } from 'react-native';
import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import { withRkTheme } from 'react-native-ui-kitten';
import { AppRoutes } from './config/navigation/routesBuilder';
import * as Screens from './screens';
import { bootstrap } from './config/bootstrap';
import { data } from './data';

bootstrap();
data.populateData();

const GanjiAppNavigator = createStackNavigator({
  First: {
    screen: Screens.SplashScreen,
  },
  Home: {
    screen: createDrawerNavigator(
      {
        ...AppRoutes,
      },
      {
        contentComponent: (props) => {
          const SideMenu = withRkTheme(Screens.SideMenu);
          return <SideMenu {...props} />;
        },
      },
    ),
  },
}, {
  headerMode: 'none',
});

const GanjiApp = createAppContainer(GanjiAppNavigator);

export default class App extends React.Component {
  state = {
    isLoaded: false,
  };

  componentWillMount() {
    this.loadAssets();
  }

  onNavigationStateChange = (previous, current) => {
    const screen = {
      current: this.getCurrentRouteName(current),
      previous: this.getCurrentRouteName(previous),
    };
  };

  getCurrentRouteName = (navigation) => {
    const route = navigation.routes[navigation.index];
    return route.routes ? this.getCurrentRouteName(route) : route.routeName;
  };

  loadAssets = async () => {
      this.setState({ isLoaded: true });
  };

  renderApp = () => (
    <View style={{ flex: 1 }}>
      <GanjiApp onNavigationStateChange={this.onNavigationStateChange} />
    </View>
  );

  render = () => (this.renderApp());
}

AppRegistry.registerComponent('Ganji', () => App);