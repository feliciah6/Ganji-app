import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
} from 'react-native-ui-kitten';
import { Avatar } from '../../components';
import { FontAwesome } from '../../assets/icons';
import NavigationType from '../../config/navigation/propTypes';
import { clientbalances } from '../../data/api/clientbalances';

export class Balances extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Asset Balances'.toUpperCase(),
  };
  
  state = {
        original: global.clientBalance,
        filtered: global.clientBalance,
        avatar: require('../../assets/images/asset.png')
    };
    
  constructor(props) {
    super(props);
    this.state.filtered = global.clientBalance;
  }

  extractItemKey = (item) => `${item.code}`;
  
  onInputChanged = (event) => {
    const pattern = new RegExp(event.nativeEvent.text, 'i');
    const assets = _.filter(this.state.original, asset => {
      const filterResult = {
        name: asset.name.search(pattern),
        code: asset.code.search(pattern),
      };
      return filterResult.name !== -1 || filterResult.code !== -1 ? asset : undefined;
    });
    this.setState({
        original: this.state.original,
        filtered: assets,
      });
  };

  onItemPressed = (item) => {
    const navigationParams = { assetName: item.name, assetCode: item.code, assetQty: item.qty };
	
    //this.props.navigation.navigate('Asset', navigationParams);
  };
  
  // method that runs when screen loads
	componentDidMount()
	{
		// runs before render()
		// fetch the balances again
    // refresh balances
    clientbalances();
    this.state.filtered = global.clientBalance;
  }

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  renderInputLabel = () => (
    <RkText rkType='awesome'>{FontAwesome.search}</RkText>
  );

  renderHeader = () => (
    <View style={styles.searchContainer}>
      <RkTextInput
        autoCapitalize='none'
        autoCorrect={false}
        onChange={this.onInputChanged}
        label={this.renderInputLabel()}
        rkType='row'
        placeholder='Search'
      />
    </View>
  );

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onItemPressed(item)}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Avatar rkType='circle' style={styles.avatar} img={this.state.avatar} />
              <RkText rkType='header5'>{item.name}</RkText>
              <RkText rkType='secondary4 hintColor'>
                {item.code}
              </RkText>
            </View>
            <RkText rkType='primary3 mediumLine'>
              {item.qty}
            </RkText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render = () => (
    <FlatList
      style={styles.root}
      data={this.state.filtered}
      extraData={this.state}
      ListHeaderComponent={this.renderHeader}
      ItemSeparatorComponent={this.renderSeparator}
      keyExtractor={this.extractItemKey}
      renderItem={this.renderItem}
    />
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center',
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingBottom: 12,
    paddingTop: 7,
    flexDirection: 'row',
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base,
  },
}));
