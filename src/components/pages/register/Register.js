import React, { Component } from 'react';

import CitizenService from '../../../services/CitizenService'

class Register extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			title: '',
			description: '',

			complaintHash: ''
		}

		this.submitComplaint = this.submitComplaint.bind(this);
		this.lookForComplaintHash = this.lookForComplaintHash.bind(this);
		this.handleChange = this.handleChange.bind(this);
	
		console.log(props)	
	}

	componentWillMount() {
		this.citizenService = new CitizenService()
		this.citizenService.init(this.props.match.params.id).then(() => {
			this.citizenService.complaintHashEvent(this.lookForComplaintHash)
		})
		
		

		console.log(this.props.match.params.id)
	}

	lookForComplaintHash(err, event) {
		console.log(event)
		this.setState({
			complaintHash: event.returnValues.hash
		})
	}
	
	submitComplaint(e) {
		e.preventDefault();

		this.setState({
			complaintHash: 'Complaint on its way'
		})

		this.citizenService.getLocation().then(pos => {
			console.log(pos)
			this.citizenService.registerComplaint({
				title: this.state.title,
				description: this.state.description,
				lat: pos.latitude * this.citizenService.LOCATION_PRECISION,
				long: pos.longitude * this.citizenService.LOCATION_PRECISION,
				deptAddress: '0x04b2b54197e68642C6C7216dc7F693e144857A0D'
			})
		}).catch(err => {
			console.log(err)
		})

		
	}

	handleChange(e) {
		this.state[e.target.name] = e.target.value;

		console.log(this.state)
	}

	render() {
		return(
			<section className="container">
				<h3>Register a complaint</h3>
				<form onSubmit={this.submitComplaint}>
					<div className="form-group row">
						<label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
						<div className="col-sm-10">
							<input type="email" className="form-control" id="email" name="email" placeholder="email@example.com" onChange={this.handleChange}/>
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="title" name="title" placeholder="tell us briefly about your problem" onChange={this.handleChange}/>
							<small id="passwordHelpBlock" className="form-text text-muted">
							  	Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
							</small>
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
						<div className="col-sm-10">
							<textarea className="form-control" id="description" name="description" placeholder="now you can tell us in detail about your problem. we are listening." onChange={this.handleChange}></textarea>
							<small id="passwordHelpBlock" className="form-text text-muted">
							  	Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
							</small>
						</div>
					</div>
					<div className="form-group row">
						<label htmlFor="description" className="col-sm-2 col-form-label">Location</label>
						<div className="col-sm-10">
							<input className="form-control" id="disabledInput" type="text" placeholder="Your GPS coordinate" disabled/>
							<small id="passwordHelpBlock" className="form-text text-muted">
							  	We take your current location as a tag to this complaint.
							</small>
						</div>
					</div>
					
					<div className="form-group row">
						<div className="col-sm-2"></div>
						<div className="col-sm-10">
						<button type="submit" className="btn btn-primary btn-block">Resolve it ASAP</button>
						</div>
					</div>
				</form>

				<h4>Complaint Hash: {this.state.complaintHash}</h4>

			</section>
		);
	}
}

export default Register;
