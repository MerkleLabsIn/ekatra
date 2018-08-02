import getWeb3 from '../utils/getWeb3'

export default class Base {

	constructor() {
		this.ACCOUNT_START = 0;
		this.LOCATION_PRECISION = 1000000;
		this.DISTANCE = 4000; 					// distance in m
	}

	async initBase(ContractJson, acc_idx) {
		// wait for web3 to load
		this.web3 = (await getWeb3).web3;

		// Get your account address
		this.accountAddress = ( await this.web3.eth.getAccounts() );

		console.log(this.accountAddress.length)

		if(this.accountAddress.length == 0) {
			this.accountAddress = 'No account found'
			return
		} else {
			this.accountAddress = this.accountAddress[acc_idx]
		}
		
		// Create a new issuer contract instance
		let contract = new this.web3.eth.Contract(
			ContractJson.abi, 
			ContractJson.networks['5777'].address, 
			{
				gasPrice: '20000000000', 
				gas: '645554',
				from: this.accountAddress
			}
		);

		return contract;
	}

	addEventListener(contract, event, filters, eventCallback) {
		contract.events[event]({
			filters,
			fromBlock: 0,
			to:'latest'
		}, (err, event) => {
			if(eventCallback !== undefined) {
				eventCallback(err, event)
			}
		})
	}

	getLocation() {
		let locationPromise = new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(pos => {
					resolve({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude
					})
				});
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		})

		return locationPromise
		
	}

	compareLocation(remoteLocation, myLocation) {
		console.log(myLocation)
		console.log(remoteLocation)

		remoteLocation = {
			latitude: remoteLocation.latitude / this.LOCATION_PRECISION,
			longitude: remoteLocation.longitude / this.LOCATION_PRECISION
		}

		console.log(myLocation)
		console.log(remoteLocation)

		var R = 6371e3; // metres
		var aa = this.toRadians(remoteLocation.latitude);
		var bb = this.toRadians(myLocation.latitude);
		var cc = this.toRadians(myLocation.latitude-remoteLocation.latitude);
		var dd = this.toRadians(myLocation.longitude-remoteLocation.longitude);

		var a = Math.sin(cc/2) * Math.sin(cc/2) +
		        Math.cos(aa) * Math.cos(bb) *
		        Math.sin(dd/2) * Math.sin(dd/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;

		console.log(d)

		return d <= this.DISTANCE;
	}

	toRadians(val) {
    	return val * Math.PI / 180;
  	}

  	statusResolve(statusCode) {
  		statusCode = Number(statusCode)
  		switch(statusCode) {
  			case 0:
  				return {
  					msg: 'Open',
  					theme: 'primary'
  				}
  			case 1:
				return {
  					msg: 'Viewed',
  					theme: 'info'
  				}
  			case 2:
				return {
  					msg: 'Ongoing',
  					theme: 'success'
  				}
  			case 3:
				return {
  					msg: 'UnderReview',
  					theme: 'warning'
  				}
  			case 4:
				return {
  					msg: 'Closed',
  					theme: 'danger'
  				}
  		}
  	}
}
