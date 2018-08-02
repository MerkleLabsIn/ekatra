import React, { Component } from 'react';

import CitizenService from '../../../services/CitizenService'

import './complaintDetails.css'

class ComplaintDetails extends Component {

	constructor(props) {
		super(props)

		this.state = {
			complaintMetadata: {},
			complaintTasks: [],
			signerListSize: ''
		}

		this.renderTaskTable = this.renderTaskTable.bind(this);
		this.onReviewChange = this.onReviewChange.bind(this);
		this.addSigner = this.addSigner.bind(this);

		console.log(this.props.match.params.id)
	}

	componentWillMount() {
		let self = this;
		this.citizenService = new CitizenService()
		this.citizenService.init(this.props.match.params.id).then(() => {
			this.citizenService.getComplaint(this.props.match.params.cid).then(res => {
				self.setState({
					complaintMetadata: {
						hash: this.props.match.params.cid,
						title: res.title,
						description: res.description,
						signerList: res.signerList,
						taskListLength: res.taskListLength,
						status: res.status
					},
					signerListSize: res.signerList.length
				}, () => {console.log(self.state)})
				
				let taskLength = res.taskListLength
				let taskPromiseArray = []
				for(let i = 0; i<taskLength; i++) {
					taskPromiseArray.push(
						this.citizenService.getTask(
							this.props.match.params.cid,
							i
						)
					)
				}
				console.log(taskPromiseArray)
				
				Promise.all(taskPromiseArray).then(result => {
					result.map(res => {
						let actualStart = Date(res.timestamps[2]);
						let actualEnd = Date(res.timestamps[3])
						let expectedStart = ( res.timestamps[0] / 60 / 60 / 24 ) + ' days'
						if(res.title === 'Assign POC') {
							expectedStart = Date(res.timestamps[0])
						}
						self.setState({
							complaintTasks: [...self.state.complaintTasks, {
								title: res.title,
								description: res.description,
								govtEntityAddress: res.govtEntityAddress,
								expectedStartTimestamp: expectedStart,
								expectedDurationTimestamp: res.timestamps[1] + ' days',
								actualStartTimestamp: actualStart,
								actualEndTimestamp: actualEnd,
								status: res.status
							}]
						}, () => {console.log(self.state)})
					})
				})

			})
		})
		console.log(this.props.match.params.id)
	}

	addSigner(complaintHash) {
		this.citizenService.addSigner(complaintHash)
	}

	renderTaskTable(item, index) {
		let self = this;
		console.log(item)

		let statusInfo = this.citizenService.statusResolve(item.status)
		console.log(statusInfo)

		let actionComponent = ''
		if(statusInfo.msg === 'UnderReview') {
			actionComponent = <div className="form-group">
								<select className="form-control form-control-sm" onChange={(e) => this.onReviewChange(e, index)}>
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
									<option>6</option>
									<option>7</option>
									<option>8</option>
									<option>9</option>
									<option>10</option>
								</select>
								</div>
		} else if(statusInfo.msg === 'Open') {
			actionComponent = <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => this.addSigner(this.state.complaintMetadata.hash)}>Support</button>
		}
		return(
				<tr key={index}>
					<th scope="row">{index+1}</th>
					<td>{item.title}</td>
					<td>{item.expectedStartTimestamp}</td>
					<td>{item.expectedDurationTimestamp}</td>
					<td>{item.actualStartTimestamp}</td>
					<td><span className={`badge badge-${statusInfo.theme}`}>{statusInfo.msg}</span></td>
					<td>{actionComponent}</td>
				</tr>
		)
	}

	onReviewChange(e, index) {
		console.log(e.target.value, index)
		console.log(this.state.complaintMetadata.hash)
		
		this.citizenService.reviewTask(
			this.state.complaintMetadata.hash,
			index,
			e.target.value
		)
	}

	render() {
		return(
			<section className="container">
				<div className="card">
					<div className="card-header">
						Complaint Metadata
					</div>
					<div className="card-body">
						<div className="card-item">
							<h5 className="card-title">Complaint Hash</h5>
							<p className="card-text">{this.state.complaintMetadata.hash}</p>
						</div>
						<div className="card-item">
							<h5 className="card-title">Title</h5>
							<p className="card-text">{this.state.complaintMetadata.title}</p>
						</div>
						<div className="card-item">
							<h5 className="card-title">Description</h5>
							<p className="card-text">{this.state.complaintMetadata.description}</p>
						</div>
						<div className="card-item">
							<h5 className="card-title">Signers Count</h5>
							<p className="card-text">{this.state.signerListSize}</p>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						Tasks
					</div>
					<div className="card-body">
						<table className="table table-hover">
							<caption><span className={"badge badge-warning"}>UnderReview</span> tasks can be reviewed by the public where 1 being the lowest score and 10 being the highest. This task or the entire complaint will not be closed until it receives an acceptable review.</caption>
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Title</th>
									<th scope="col">Expected Start Time</th>
									<th scope="col">Expected Duration</th>
									<th scope="col">Actual Start Time</th>
									<th scope="col">Status</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{this.state.complaintTasks.map(this.renderTaskTable)}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		)
	}
}

export default ComplaintDetails
