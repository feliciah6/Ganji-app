/* eslint-disable react/no-multi-comp */
import React from 'react';

import { CategoryMenu } from './categoryMenu';
import * as Routes from '../../config/navigation/routesBuilder';
import NavigationType from '../../config/navigation/propTypes';

export class WalletMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'My Wallet'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.WalletRoutes} />
  );
}

export class NavigationMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Navigation'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.NavigationRoutes} />
  );
}

export class AccountMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Account'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.AccountRoutes} />
  );
}

export class ArticleMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Articles'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.ArticleRoutes} />
  );
}

export class MessagingMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Messaging'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.MessagingRoutes} />
  );
}

export class DashboardMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Dashboards'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.DashboardRoutes} />
  );
}

export class TourMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'GanjiTour'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.TourRoutes} />
  );
}

export class EcommerceMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Ecommerce'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.EcommerceRoutes} />
  );
}

export class OtherMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Other'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.OtherRoutes} />
  );
}
