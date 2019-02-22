import React from 'react';
import {
  View,
  Image,
  Keyboard,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/';
import { scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import Icon from 'react-native-ionicons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { clientbalances } from '../../data/api/clientbalances';
import base64 from 'base-64';

export class Send extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  
  
  constructor(props) {
    super(props);
    // get the login from the global
    const login = global.client[2];
    // create the values for the form
    this.state = {
      sender: login,
      recipient: '',
      amounts: undefined,
      tmpCurr: '',
      tmpQty: 0,
      tmpBal: 0,
      rows: []
    };
  }
  
  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/logo.png') : require('../../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );
  
  extractItemKey = (item) => `${item.code}`;
  
  onTxtCurrencyChanged = (item) => {
    // set temp currency
    this.setState({ tmpCurr: item });
    this.setState({ tmpBal: item.qty });
	};
  
  onTxtAmountChanged = (text) => {
    // check if numeric
    if (!isNaN(parseFloat(text)) && isFinite(text))
    {
      // set temp quantity
      this.setState({ tmpQty: text });
    }
    else
    {
      this.setState({ tmpQty: 0 });
    }
  }
  
  onItemPressed = (item) => {
    const navigationParams = { name: item.name, code: item.code, qty: item.qty };
	
    //this.props.navigation.navigate('Asset', navigationParams);
  };
  
  onAddRowButtonPressed = () => {
    // check for validation
    if (this.state.tmpQty == '' || this.state.tmpCurr == '')
    {
      // alert about fields
      Alert.alert('Ganji', 'You must enter all required information to add a row ' + global.client[2] + '!', [{text: 'OK'}]);
    }
    else
    {
      // check if the amount makes sense
      if (parseFloat(this.state.tmpQty) > parseFloat(this.state.tmpBal))
      {
        // insufficient funds
        var msgTxt = 'You have ' + this.state.tmpBal + ' ' + this.state.tmpCurr.id + ' and you wish to send ' + this.state.tmpQty + ' ' + this.state.tmpCurr.id;
        Alert.alert('Ganji: Insufficient Funds',  msgTxt, [{text: 'OK'}]);
      }
      else
      {
        // add to list
        var rowsTmp = this.state.rows;
        var newRows = [];
        var duplicate = false;
		var oldRow = undefined;
        if (rowsTmp.length > 0)
        {
          // check if we already have this asset in the list
          for (i = 0; i < rowsTmp.length; i++)
          {
            if (rowsTmp[i].name === this.state.tmpCurr.name)
            {
              // set duplicate flag
              duplicate = true;
            }
			else
			{
				// add to newRows
				newRows.push(rowsTmp[i]);
			}
          }
          // if we have a duplicate, ask for action
          if (duplicate === true)
          {
            var msgTxt = 'You already have ' + this.state.tmpCurr.id + ' in your list. Replace with this entry?';
              Alert.alert('Ganji',  msgTxt, [
                {text: 'Replace', onPress: () => {
						// replace entire object so that the new row is used
						newRows.push({name: this.state.tmpCurr.name, qty: this.state.tmpQty, code: this.state.tmpCurr.id});
						this.setState({rows: newRows});
					}
				},
                {text: 'Keep Existing', onPress: () => {
						// just use the old values
						this.setState({rows: rowsTmp})
					}
				}
              ], { cancelable: false });
          }
          else
          {
            // proceed normally
            rowsTmp.push({name: this.state.tmpCurr.name, qty: this.state.tmpQty, code: this.state.tmpCurr.id});
            // add the data to the rows state
            this.setState({rows: rowsTmp})
          }
        }
        else
        {
          // add the data to the rows state
          rowsTmp.push({name: this.state.tmpCurr.name, qty: this.state.tmpQty, code: this.state.tmpCurr.id});
          this.setState({rows: rowsTmp})
        }
      }
    }
  }
  
  onTransferButtonPressed = () => {
    // check fields for validations
    if (this.state.recipient == '' || this.state.amounts == '')
    {
      // alert about fields
      Alert.alert('Ganji', 'You must enter a valid recipient ' + global.client[2] + '!', [{text: 'OK'}]);
    }
    else
    {
      // create the payload
      var payload = {};
      for (i = 0; i < this.state.rows.length; i++)
		{
			// add to payload object
			payload[this.state.rows[i].name] = parseFloat(this.state.rows[i].qty);
		}
      this.state.amounts = JSON.stringify(payload);
      // make the call to the API
      return fetch('http://162.144.151.204:9432/ganji/clients/transfer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode('maxim:guap18')
          },
          body: JSON.stringify(this.state),
        }
      )
      .then((response) => response.json())
      .then((responseJson) => {
        Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
        if (responseJson.kikapu.Error === false)
        {
          this.props.navigation.navigate('WalletMenu');
        }
        else
        {
          Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
		  // refresh balances
			clientbalances();
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Ganji', error, [{text: 'OK'}]);
      });
    }
  };

  onCancelButtonPressed = () => {
    this.props.navigation.navigate('WalletMenu');
  };
  
  renderSeparator = () => (
    <View style={styles.separator} />
  );
  
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onItemPressed(item)}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
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
  
  renderHeader = () => (
    <View style={styles.listhead}>
      <RkText rkType='row'>List of assets to send</RkText>
    </View>
  );

  render = () => (
    <ScrollView keyboardShouldPersistTaps='always'>
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>
        <View style={{ alignItems: 'center' }}>
          {this.renderImage()}
          <RkText rkType='h1'>Peer to Peer Transfer</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput rkType='rounded' placeholder='Recipient' onChangeText={(recipient) => this.setState({recipient})}/>
            <RkText rkType='row'>Add asset to transfer list</RkText>
            <SearchableDropdown rkType='rounded' onItemSelect={item => this.onTxtCurrencyChanged(item)} 
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
              items={global.assetsHeld}
              placeholder="Please pick a currency"
              resetValue={false}
              underlineColorAndroid='transparent'
            />
            <RkTextInput rkType='rounded' placeholder='Amount to send (e.g. 20.00)' onChangeText={amount => this.onTxtAmountChanged(amount)}/>
             <GradientButton style={styles.save} rkType='large' text='ADD ROW' onPress={this.onAddRowButtonPressed} />
          </View>
          <View>
            <FlatList
              style={styles.root}
              data={this.state.rows}
              extraData={this.state}
              ListHeaderComponent={this.renderHeader}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={this.extractItemKey}
              renderItem={this.renderItem}
            />
          </View>
          <View>
            <RkText rkType='row'>Click send when done adding assets</RkText>
            <GradientButton style={styles.save} rkType='large' text='SEND' onPress={this.onTransferButtonPressed} />
          </View>
          
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkButton rkType='clear' onPress={this.onCancelButtonPressed}>
                <RkText rkType='header6'>Go back to my wallet</RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </RkAvoidKeyboard>
    </ScrollView>
  )
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  listhead: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 40,
    alignItems: 'center',
  },
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
