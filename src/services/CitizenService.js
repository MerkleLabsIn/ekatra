import Base from './Base'

import EkatraContract from '../../build/contracts/Ekatra.json'
import GovtEntityContract from '../../build/contracts/GovtEntity.json'

export default class Citizen extends Base {

 	init = async (accIdx) => {
 		this.ACCOUNT_START = Number(0);

		this.ekatraContract = await this.initBase(EkatraContract, Number(this.ACCOUNT_START) + Number(accIdx));
		
		this.ekatraContract.methods.initGovtEntity(GovtEntityContract.networks['5777'].address).send().then(console.log)

		console.log(Number(this.ACCOUNT_START) + Number(accIdx));
		console.log(this.accountAddress)
	}

	complaintHashEvent = async (callback) => {
		let self = this
		this.addEventListener(
			self.ekatraContract,
			'ComplaintHash', 
			{
				complainant: self.accountAddress
			},
			callback
		)
	}

	newComplaintEvent = async (callback) => {
		let self = this
		this.addEventListener(
			self.ekatraContract,
			'NewComplaintEvent',
			undefined,
			callback
		)
	}

	newTaskEvent = async (callback) => {
		let self = this
		this.addEventListener(
			self.ekatraContract,
			'NewTaskEvent',
			{
				govtEntityAddress: self.accountAddress
			},
			callback
		)
	}
	
	registerComplaint(registrationDetails) {
		console.log('resgistering...')
		console.log(registrationDetails)
		this.ekatraContract.methods.registerComplaint(
			registrationDetails.title,
			registrationDetails.description,
			registrationDetails.lat,
			registrationDetails.long,
			registrationDetails.deptAddress
		).send().then((trans) => {
			console.log(trans)
		})
	}

	// START: Task related functions
	addTask(taskDetails) {
		this.ekatraContract.methods.addTask(
			taskDetails.complaintHash,
			taskDetails.title,
			taskDetails.description,
			taskDetails.govtEntityAddress
		).send().then((trans) => {
			console.log(trans)
		})
	}

	getTask(complaintHash, taskId) {
		return this.ekatraContract.methods.getTask(
			complaintHash,
			taskId
		).call()
	}

	startTask(complaintHash, taskId) {
		this.ekatraContract.methods.startTask(
			complaintHash,
			taskId
		).send().then(console.log)
	}

	endTask(complaintHash, taskId) {
		this.ekatraContract.methods.endTask(
			complaintHash,
			taskId
		).send().then(console.log)
	}

	updateTaskDetails(complaintHash, taskId, details) {
		this.ekatraContract.methods.updateTaskDetails(
			complaintHash,
			taskId,
			details.expectedStartTimestamp,
			details.expectedDurationTimestamp
		).send().then(console.log)
	}

	lastTask(complaintHash, taskId) {
		this.ekatraContract.methods.lastTask(
			complaintHash,
			taskId
		).send().then(console.log)
	}
	// END: Task related functions


	getComplaint = (complaintHash) => {
		return this.ekatraContract.methods.getComplaint(complaintHash).call()
	}


	reviewTask = (complaintHash, taskId, reward) => {
		console.log(this.ekatraContract)
		this.ekatraContract.methods.reviewTask(
			complaintHash, 
			taskId, 
			reward
		).send().then(console.log)
	}

	getReview = (complaintHash, taskId) => {
		return this.ekatraContract.methods.getReview(
			complaintHash, 
			taskId
		).call()
	}

	addSigner = (complaintHash) => {
		this.ekatraContract.methods.addSigner(complaintHash).send().then(console.log)
	}
	// get a complaint
	// get all tasks associated with a complaint
}
