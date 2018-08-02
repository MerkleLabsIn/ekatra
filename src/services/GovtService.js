import Base from './Base'

/*import EkatraContract from '../../build/contracts/Ekatra.json'*/
import GovtEntityContract from '../../build/contracts/GovtEntity.json'

export default class GovtService extends Base {

	init = async (accIdx) => {
 		this.ACCOUNT_START = Number(0);

		this.govtContract = await this.initBase(GovtEntityContract, Number(this.ACCOUNT_START) + Number(accIdx));
		
		console.log(this.govtContract)
		console.log(Number(this.ACCOUNT_START) + Number(accIdx));
		console.log(this.accountAddress)
	}

	registerName = async (name) => {
		this.govtContract.methods.registerName(name).send().then(console.log)
	}

	getReward = async () => {
		return this.govtContract.methods.getReward().call()
	}

	getDetails = async () => {
		return this.govtContract.methods.getDetails().call()
	}

}
