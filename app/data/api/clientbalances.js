import React from 'react';
import {
	Alert,
	NetInfo,
} from 'react-native';
import base64 from 'base-64';

function clientbalances()
{
	// create the payload
	var payload = {login: global.client[2]};
	// make the call to the API
	fetch('http://162.144.151.204:9432/ganji/clients/balance',
	{
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Basic ' + base64.encode('maxim:guap18')
	  },
	  body: JSON.stringify(payload),
	}
	)
	.then((response) => response.json())
	.then((responseJson) =>
	{
		if (responseJson.kikapu.Error === false)
		{
			// this is the asset data
			global.clientBalance = responseJson.kikapu.Data;
			// get list of client assets
			var assetRaw = global.clientBalance;
			var assetsHeldList = [];
			// create a list of dict objects
			for (i = 0; i < assetRaw.length; i++)
			{
				// create the object and add to the list
				var a = {name: assetRaw[i].name, id: assetRaw[i].code, qty: assetRaw[i].qty};
				assetsHeldList.push(a);
			}
			global.assetsHeld = assetsHeldList;
			return global.clientBalance;
		}
		else
		{
			Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
			global.clientBalance = {};
			global.assetsHeld = {};
			return global.clientBalance;
		}
	})
	.catch((error) =>
	{
		console.error(error);
		Alert.alert('Ganji', error, [{text: 'OK'}]);
		global.clientBalance = {};
		global.assetsHeld = {};
		return global.clientBalance;
	});
}

export const clientbalances = clientbalances;