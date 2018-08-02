import React, { Component } from 'react';

import GovtService from '../../../services/GovtService'

import './govtDept.css'

class GovtDept extends Component {

	constructor(props) {
		super(props)
	
		this.state = {
			name: '',
			rewards: '',

			currentName: ''
		}

		this.fetchDetails = this.fetchDetails.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.submitNameChange = this.submitNameChange.bind(this);
	}

	componentWillMount() {
		this.govtService = new GovtService()
		this.govtService.init(this.props.match.params.id).then(() => {
			this.fetchDetails()
		}) 
		console.log(this.props.match.params.id)


	}

	handleChange(e) {
		this.state[e.target.name] = e.target.value;

		console.log(this.state)
	}

	fetchDetails() {
		let self = this;
		this.govtService.getDetails().then(res => {
			if(res.name === '') {
				res.name = 'No Name assigned'
			}
			self.setState({
				name: res.name,
				rewards: Number(res.reward)
			})
		})
	}

	submitNameChange(e) {
		e.preventDefault()

		this.govtService.registerName(this.state.name)
	}

	render() {
		return(
			<section className="container">
				<ul className="nav nav-tabs" id="myTab" role="tablist">
					<li className="nav-item">
						<a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Claim your Identity</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">View Your reward points</a>
					</li>
				</ul>
				<div className="tab-content" id="myTabContent">
					<div className="tab-pane fade show active claim" id="home" role="tabpanel" aria-labelledby="home-tab">
						<h3 className="current-name">Your current Name: {this.state.name}</h3>
						<form onSubmit={this.submitNameChange}>
							<div className="form-group row">
								<label htmlFor="name" className="col-sm-2 col-form-label">Entity/Person Name</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" id="name" name="name" placeholder="MCD" onChange={this.handleChange}/>
									<small id="passwordHelpBlock" className="form-text text-muted">
									  	This is the name of the organisation or any person.
									</small>
								</div>
							</div>
							
							<div className="form-group row">
								<div className="col-sm-2"></div>
								<div className="col-sm-10">
									<button type="submit" className="btn btn-success btn-lg btn-block">Update</button>
								</div>
							</div>
						</form>	
					</div>
					
					<div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
						<h4>Your current reward points are:</h4>
						<h2>{this.state.rewards}</h2>
					</div>
				</div>
			</section>
		)
	}
}

export default GovtDept;
