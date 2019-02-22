import _ from 'lodash';
import { FontIcons } from '../../assets/icons';
import * as Screens from '../../screens/index';
import { FontAwesome } from '../../assets/icons';

export const MainRoutes = [
  {
    id: 'WalletMenu',
    title: 'My Wallet',
    icon: FontIcons.card,
    screen: Screens.WalletMenu,
    children: [
      {
        id: 'Deposit',
        title: 'Deposit',
        screen: Screens.Deposit,
        children: [],
      },
      {
        id: 'Withdraw',
        title: 'Withdraw',
        screen: Screens.Withdraw,
        children: [],
      },
      {
        id: 'Balances',
        title: 'Balances',
        screen: Screens.Balances,
        children: [],
      },
      {
        id: 'Send',
        title: 'Send',
        screen: Screens.Send,
        children: [],
      },
      {
        id: 'Transactions',
        title: 'Transactions',
        screen: Screens.Transactions,
        children: [],
      },
    ],
  },
  {
    id: 'AccountMenu',
    title: 'My Account',
    icon: FontIcons.profile,
    screen: Screens.AccountMenu,
    children: [
      {
        id: 'ProfileSettings',
        title: 'Profile Settings',
        screen: Screens.ProfileSettings,
        children: [],
      },
    ],
  },
  {
    id: 'ArticlesMenu',
    title: 'Articles',
    icon: FontIcons.article,
    screen: Screens.ArticleMenu,
    children: [
      {
        id: 'Articles1',
        title: 'Article List V1',
        screen: Screens.Articles1,
        children: [],
      },
      {
        id: 'Articles2',
        title: 'Article List V2',
        screen: Screens.Articles2,
        children: [],
      },
      {
        id: 'Articles3',
        title: 'Article List V3',
        screen: Screens.Articles3,
        children: [],
      },
      {
        id: 'Articles4',
        title: 'Article List V4',
        screen: Screens.Articles4,
        children: [],
      },
      {
        id: 'Blogposts',
        title: 'Blogposts',
        screen: Screens.Blogposts,
        children: [],
      },
      {
        id: 'Article',
        title: 'Article View',
        screen: Screens.Article,
        children: [],
      },
    ],
  },
  {
    id: 'DashboardsMenu',
    title: 'Dashboards',
    icon: FontIcons.dashboard,
    screen: Screens.DashboardMenu,
    children: [{
      id: 'Dashboard',
      title: 'Dashboard',
      screen: Screens.Dashboard,
      children: [],
    }],
  },
  {
    id: 'TourMenu',
    title: 'GanjiTour',
    icon: FontIcons.mobile,
    screen: Screens.TourMenu,
    children: [{
      id: 'GanjiTour',
      title: 'GanjiTour',
      screen: Screens.GanjiTour,
      children: [],
    }],
  },
  {
    id: 'NavigationMenu',
    icon: FontIcons.navigation,
    title: 'Navigation',
    screen: Screens.NavigationMenu,
    children: [
      {
        id: 'Landing',
        title: 'Landing',
        screen: Screens.Landing,
        children: [],
      },
      {
        id: 'List',
        title: 'List Menu',
        screen: Screens.ListMenu,
        children: [],
      },
      {
        id: 'Side',
        title: 'Side Menu',
        action: 'DrawerOpen',
        screen: Screens.SideMenu,
        children: [],
      },
    ],
  },
  {
    id: 'OtherMenu',
    title: 'Other',
    icon: FontIcons.other,
    screen: Screens.OtherMenu,
    children: [
      {
        id: 'Settings',
        title: 'Settings',
        screen: Screens.Settings,
        children: [],
      },
      {
        id: 'SignUp',
        title: 'SignUp',
        screen: Screens.SignUp,
        children: [],
      },
      {
        id: 'Register',
        title: 'Register',
        screen: Screens.Register,
        children: [],
      },
      {
        id: 'password',
        title: 'Password Recovery',
        screen: Screens.PasswordRecovery,
        children: [],
      },
      {
        id: 'ProfileV1',
        title: 'User Profile V1',
        screen: Screens.ProfileV1,
        children: [],
      },
      {
        id: 'ProfileV2',
        title: 'User Profile V2',
        screen: Screens.ProfileV2,
        children: [],
      },
      {
        id: 'ProfileV3',
        title: 'User Profile V3',
        screen: Screens.ProfileV3,
        children: [],
      },
      {
        id: 'Notifications',
        title: 'Notifications',
        screen: Screens.Notifications,
        children: [],
      },
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        children: [],
      },
      {
        id: 'Feed',
        title: 'Feed',
        screen: Screens.Feed,
        children: [],
      },
    ],
  },
  {
    id: 'Themes',
    title: 'Themes',
    icon: FontIcons.theme,
    screen: Screens.Themes,
    children: [],
  },
  {
    id: 'Logout',
    title: 'Logout',
    icon: FontIcons.login,
    screen: Screens.Logout,
    children: [],
  },
];

const menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'Login',
  title: 'Start',
  screen: Screens.Login,
  children: [],
});

export const MenuRoutes = menuRoutes;
