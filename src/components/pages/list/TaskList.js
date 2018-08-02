import React, { Component } from 'react';

import CitizenService from '../../../services/CitizenService'

import './taskList.css'

class TaskList extends Component {

	constructor(props) {
		super(props)

		this.state = {
			taskList: [],
			
			govtEntityAddress: '',
			title: '',
			description: '',
			
			expectedStartTimestamp: '',
			expectedDurationTimestamp: '',

			complaintHash: '',
			taskId: '',

			reviews: {}
		}

		this.newTaskListener = this.newTaskListener.bind(this);
		this.renderTaskTable = this.renderTaskTable.bind(this);
		this.submitNewtask = this.submitNewtask.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.startTask = this.startTask.bind(this);
		this.startTaskSetMetadata = this.startTaskSetMetadata.bind(this);
		this.updateTask = this.updateTask.bind(this);
		this.lastTask = this.lastTask.bind(this);
		this.getReview = this.getReview.bind(this);
	}

	componentWillMount() {
		this.citizenService = new CitizenService()
		this.citizenService.init(this.props.match.params.id).then(() => {
			this.citizenService.newTaskEvent(this.newTaskListener)
		})
		console.log(this.props.match.params.id)

		this.myLocation = this.citizenService.getLocation()


	}

	newTaskListener(err, event) {
		console.log(event)
		let self = this
		this.citizenService.getTask(
			event.returnValues.complaintHash,
			Number(event.returnValues.taskId)
		).then(res => {
			let actualStart = Date(res.timestamps[2]);
			let actualEnd = Date(res.timestamps[3])
			let expectedStart = ( res.timestamps[0] / 60 / 60 / 24 ) + ' days'
			if(res.title === 'Assign POC') {
				expectedStart = Date(res.timestamps[0])
			}
			self.setState({
				taskList: [...self.state.taskList, {
					complaintHash: event.returnValues.complaintHash,
					taskId: Number(event.returnValues.taskId),
					title: res.title,
					description: res.description,
					govtEntityAddress: res.govtEntityAddress,
					expectedStartTimestamp: expectedStart,
					expectedDurationTimestamp: res.timestamps[1] + ' days',
					actualStartTimestamp: actualStart,
					actualEndTimestamp: actualEnd,
					status: res.status,
					
				}]
			}, () => {console.log(self.state)})
		})
	}

	startTaskSetMetadata(complaintHash, taskId) {
		this.state.complaintHash = complaintHash
		this.state.taskId = taskId
	}

	startTask(complaintHash, taskId) {
		this.citizenService.startTask(complaintHash, taskId)
	}

	updateTask(e) {
		e.preventDefault()

		this.citizenService.updateTaskDetails(
			this.state.complaintHash, 
			this.state.taskId,
			{
				expectedStartTimestamp: this.state.expectedStartTimestamp,
				expectedDurationTimestamp: this.state.expectedDurationTimestamp
			}
		)
	}

	getReview(complaintHash, taskId, msg) {
		if(msg === 'UnderReview') {
			console.log(complaintHash, taskId)
			let self = this;
			this.citizenService.getReview(complaintHash, taskId).then((res) => {
				console.log(res)
				let newState = Object.assign({}, this.state);

				let score = 0
				if(Number(res.total) !== 0 && Number(res.sum) !== 0) {
					score = Number(res.sum) / Number(res.total)
					console.log(res.sum, res.total)
				}
				newState.reviews[complaintHash + taskId] = score + ' points';
				console.log('fdsfdfd' + score)
				console.log(newState)
				self.setState(newState, console.log)
			})
		}
	}

	endTask(complaintHash, taskId) {
		this.citizenService.endTask(
			complaintHash,
			taskId
		)
	}

	renderTaskTable(item, index) {
		let self = this;

		let statusInfo = this.citizenService.statusResolve(item.status)
		console.log(statusInfo)

		let action = <button type="button" className="btn btn-primary btn-sm btn-block" data-toggle="modal" data-target="#exampleModalCenter" onClick={() => this.startTaskSetMetadata(item.complaintHash, item.taskId)}>Follow up</button>
		if(statusInfo.msg === 'Open') {
			action = <button type="button" className="btn btn-primary btn-sm btn-block" data-toggle="modal" data-target="#expectedDuration" onClick={() => this.startTaskSetMetadata(item.complaintHash, item.taskId)}>Update</button>
		} else if(statusInfo.msg === 'Viewed') {
			action = <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => this.startTask(item.complaintHash, item.taskId)}>Start</button>
		} else if(statusInfo.msg === 'UnderReview') {
			action = <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => this.endTask(item.complaintHash, item.taskId)}>Close</button>
		} else if(statusInfo.msg === 'Closed') {
			action = ''
		}

		let actionBox = <span className={`badge badge-${statusInfo.theme}`} onClick={() => this.getReview(item.complaintHash, item.taskId, statusInfo.msg)}>{statusInfo.msg}</span>

		return(
				<tr key={index}>
					<th scope="row">{index+1}</th>
					<td><a href={`/complaint-details/${self.props.match.params.id}/${item.complaintHash}`} target="_blank">{item.complaintHash.substring(0,14)}...</a></td>
					<td data-toggle="tooltip" data-placement="top" title={item.description}>{item.title}</td>
					<td>{item.expectedStartTimestamp}</td>
					<td>{item.expectedDurationTimestamp}</td>
					<td>{item.actualStartTimestamp}</td>
					<td>{item.actualEndTimestamp}</td>
					<td>{actionBox}<span className="badge badge-light">{this.state.reviews[item.complaintHash + item.taskId]}</span></td>
					<td>{action}</td>
				</tr>
		)
	}

	handleChange(e) {
		this.state[e.target.name] = e.target.value;

		console.log(this.state)
	}

	submitNewtask(e) {
		e.preventDefault();

		this.setState({
			complaintHash: 'Complaint on its way'
		})
		
		this.citizenService.addTask({
			complaintHash: this.state.complaintHash,
			title: this.state.title,
			description: this.state.description,
			govtEntityAddress: this.state.govtEntityAddress
		})

		
	}

	lastTask() {
		this.citizenService.lastTask(
			this.state.complaintHash, 
			this.state.taskId,
		)
	}

	render() {
		return(
			<section className="container">
				<div className="card">
					<div className="card-header">
						Tasks
					</div>
					<div className="card-body">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Complaint Hash</th>
									<th scope="col">Title</th>
									<th scope="col">Expected Start Time</th>
									<th scope="col">Expected Duration</th>
									<th scope="col">Actual Start Time</th>
									<th scope="col">Actual End Time</th>
									<th scope="col">Status</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{this.state.taskList.map(this.renderTaskTable)}
							</tbody>
						</table>
					</div>
				</div>

				<div className="modal fade bd-example-modal-lg" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLongTitle">Complaint Follow Up</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group row">
										<div className="col-sm-12">
											<button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.lastTask}>End of Complaint</button>
										</div>
									</div>
								<h3 className="or-big">or</h3>
								<h3>Add a follow up</h3>
								<form onSubmit={this.submitNewtask}>
									<div className="form-group row">
										<label htmlFor="govtEntityAddress" className="col-sm-2 col-form-label">Allocated to</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="govtEntityAddress" name="govtEntityAddress" placeholder="0x04b2b54197e68642C6C7216dc7F693e144857A0D" onChange={this.handleChange}/>
										</div>
									</div>
									<div className="form-group row">
										<label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="title" name="title" placeholder="brief about this task" onChange={this.handleChange}/>
										</div>
									</div>
									<div className="form-group row">
										<label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
										<div className="col-sm-10">
											<textarea className="form-control" id="description" name="description" placeholder="add description to the follow up" onChange={this.handleChange}></textarea>
											<small id="passwordHelpBlock" className="form-text text-muted">
											  	Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
											</small>
										</div>
									</div>
									
									<div className="form-group row">
										<div className="col-sm-12">
											<button type="submit" className="btn btn-success btn-lg btn-block">Open Task</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>


				<div className="modal fade" id="expectedDuration" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLongTitle">Add expected time to complete</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<form onSubmit={this.updateTask}>
									<div className="form-group row">
										<label htmlFor="expectedStartTimestamp" className="col-sm-3 col-form-label">Expected Start Time</label>
										<div className="col-sm-9">
											<input type="text" className="form-control" id="expectedStartTimestamp" name="expectedStartTimestamp" placeholder="25 July 2018" onChange={this.handleChange}/>
											<small id="passwordHelpBlock" className="form-text text-muted">
											  	This is an expected start date of this task.
											</small>
										</div>
									</div>
									<div className="form-group row">
										<label htmlFor="expectedDurationTimestamp" className="col-sm-3 col-form-label">Duration</label>
										<div className="col-sm-9">
											<input type="text" className="form-control" id="expectedDurationTimestamp" name="expectedDurationTimestamp" placeholder="3" onChange={this.handleChange}/>
										</div>
									</div>
									
									<div className="form-group row">
										<div className="col-sm-12">
											<button type="submit" className="btn btn-success btn-lg btn-block">Update</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

			</section>
		)
	}
}

export default TaskList;
