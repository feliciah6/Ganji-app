import React from 'react';
import {
	Alert,
	NetInfo,
} from 'react-native';
import base64 from 'base-64';

function clienttransactions()
{
	// create the payload
	var payload = {login: global.client[2]};
	// make the call to the API
	fetch('http://162.144.151.204:9432/ganji/clients/tx',
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
			// this is the tx data
			var txRaw = responseJson.kikapu.Data;
			var txClean = [];
			var txSystem = [];
			// sort out and exclude permission transactions etc
			for (i = 0; i < txRaw.length; i++)
			{
				if (txRaw[i].cc_count === 0 || txRaw[i].balance.assets.length === 0 || txRaw[i].counterparty === 'Unknown Counterparty')
				{
					// ignore non-asset transactions
					txSystem.push(txRaw[i]);
				}
				else
				{
					// check direction
					var direction = '';
					if (txRaw[i].balance.assets[0].qty < 0)
					{
						direction = 'OUT';
					}
					else
					{
						direction = 'IN';
					}
					// asset transactions; create the object and add to the list
					var a = {party: txRaw[i].counterparty, id: txRaw[i].txid, time: txRaw[i].timereceived, conf: txRaw[i].confirmations,
						assets: txRaw[i].balance.assets, cpaddress: txRaw[i].addresses[0], direction: direction};
					txClean.push(a);
				}
			}
			global.clientTx = txClean;
		}
		else
		{
			Alert.alert('Ganji', responseJson.kikapu.ResultDesc, [{text: 'OK'}]);
			global.clientTx = {};
			return global.clientTx;
		}
	})
	.catch((error) =>
	{
		console.error(error);
		Alert.alert('Ganji', error, [{text: 'OK'}]);
		global.clientTx = {};
		return global.clientTx;
	});
}

export const clienttransactions = clienttransactions;