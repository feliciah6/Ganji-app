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
import { clienttransactions } from '../../data/api/clienttransactions';

function findInObjectList(obj, pattern, field)
{
    var findFlag = false;
    for (j = 0; j < obj.length; j++)
    {
      var result = obj[j][field].search(pattern);
      if (result !== -1)
      {
        findFlag = true;
        break;
      }
    }
    if (findFlag === true)
    {
      return 5;
    }
    else
    {
      return -1;
    }
}

function formatAssets(payload)
{
  var finalString = '';
  // loop and format
  for (j = 0; j < payload.length; j++)
  {
    var r = payload[j].qty.toString() + ' ' + payload[j].code + ', ';
    finalString += r;
  }
  return finalString;
}

export class Transactions extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Transaction Ledger'.toUpperCase(),
  };
  
  state = {
        original: global.clientTx,
        filtered: global.clientTx,
        avatar: require('../../assets/images/tx.png')
    };
    
  constructor(props) {
    super(props);
    this.state.filtered = global.clientTx;
  }

  extractItemKey = (item) => `${item.id}`;
  
  onInputChanged = (event) =>
  {
    const pattern = new RegExp(event.nativeEvent.text, 'i');
    const txs = _.filter(this.state.original, tx => {
      const filterResult = {
        id: tx.id.search(pattern),
        asset: findInObjectList(tx.assets, pattern, 'name'),
        cpaddress: tx.cpaddress.search(pattern),
        party: tx.party.search(pattern)
      };
      return filterResult.id !== -1 || filterResult.asset !== -1 || filterResult.cpaddress !== -1 || filterResult.party !== -1 ? tx : undefined;
    });
    this.setState({
        original: this.state.original,
        filtered: txs,
      });
  };
  
  onItemPressed = (item) => {
    const navigationParams = { txID: item.id, txAssets: item.assets, txAddress: item.party };
    //this.props.navigation.navigate('Asset', navigationParams);
  };
  
  // method that runs when screen loads
	componentDidMount()
	{
		// runs before render()
		// fetch the transactions again
    // refresh transactions
    clienttransactions();
    this.state.filtered = global.clientTx;
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
              <RkText rkType='header5'>{item.party}</RkText>
              <RkText rkType='secondary4 hintColor'>
                {item.direction}
              </RkText>
            </View>
            <RkText numberOfLines={2} rkType='primary3 mediumLine' style={{ paddingTop: 5 }}>
              {formatAssets(item.assets)}
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
