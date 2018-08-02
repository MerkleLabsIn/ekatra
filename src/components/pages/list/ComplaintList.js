import React, { Component } from 'react';
import {withRouter} from "react-router-dom";

import CitizenService from '../../../services/CitizenService'

class ComplaintList extends Component {

	constructor() {
		super();

		this.state = {
			newComplaintList: []
		}

		this.myLocation = {}

		this.newComplaintListener = this.newComplaintListener.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.renderComplaintTable = this.renderComplaintTable.bind(this);

	}

	componentWillMount() {
		this.citizenService = new CitizenService()
		this.citizenService.init(this.props.match.params.id).then(() => {
			this.citizenService.newComplaintEvent(this.newComplaintListener)
		})
		console.log(this.props.match.params.id)

		this.myLocation = this.citizenService.getLocation()
	}

	newComplaintListener(err, event) {
		console.log(event)	
		
		let self = this
		this.myLocation.then(pos => {
			if(self.citizenService.compareLocation({
				latitude: Number(event.returnValues.lat),
				longitude: Number(event.returnValues.long)
			}, pos)) {
				self.citizenService.getComplaint(event.returnValues.hash).then(res => {
					console.log(res)
					self.setState({
						newComplaintList: [...self.state.newComplaintList, {
							hash: event.returnValues.hash,
							title: res.title,
							description: res.description,
							signerList: res.signerList,
							taskListLength: res.taskListLength,
							status: res.status
						}]
					}, () => {console.log(self.state)})
				})
			}
		})
		
	}

	handleRowClick(hash) {
		console.log(hash)
		this.props.history.push(`/complaint-details/${this.props.match.params.id}/${hash}`);
	}

	renderComplaintTable(item, index) {
		let self = this;
		console.log(item)
		return(
				<tr key={index} onClick={() => this.handleRowClick(item.hash)}>
					<th scope="row">{index+1}</th>
					<td>{item.title}</td>
					<td>{item.taskListLength}</td>
					<td>{item.signerList.length}</td>
					<td>{item.status}</td>
					<td></td>
				</tr>
		)
	}

	render() {
		return(
			<section className="container">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Title</th>
							<th scope="col"># of tasks</th>
							<th scope="col"># of signers</th>
							<th scope="col">Status</th>
							<th>Sign</th>
						</tr>
					</thead>
					<tbody>
						{this.state.newComplaintList.map(this.renderComplaintTable)}
					</tbody>
				</table>
			</section>
		)
	}
}

export default ComplaintList;
