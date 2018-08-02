import React from "react";

import {Link} from 'react-router-dom';

import './home.css'

export default class Home extends React.Component {

	constructor() {
		super()

	}

	imageClick(e,r) {
		switch(e) {
			case 1:

		}
	}


	render() {
		return (
		  <div className="container home-div">
		  	<div className="row">
		  		<div className="col-md-6 profile">
		  			<a href="/register/0">
			  			<img src="/img/s2.svg" onClick={this.imageClick.bind(this, 1)} />
				    	<h4>Citizen 1</h4>	
		    		</a>
		    	</div>
		    	<div className="col-md-6 profile">
		    		<a href="/register/1">
			    		<img src="/img/cop1.svg" onClick={this.imageClick.bind(this, 2)}/>
			    		<h4>Citizen 2</h4>
		    		</a>
		    	</div>
		  	</div>
		  	<br/>
		  	<br/>
		    <div className="row">
		    	<div className="col-md-3 profile">
		    		<a href="/list/2">
			    		<img src="/img/ia1.svg" onClick={this.imageClick.bind(this, 4)}/>
			    		<h4>Citizen 3</h4>
		    		</a>
		    	</div>
		    	<div className="col-md-3 profile">
	    			<a href="/register/3">
			    		<img src="/img/ia2.svg" onClick={this.imageClick.bind(this, 5)}/>
			    		<h4>Citizen 4</h4>
			    	</a>
		    	</div>
		    	<div className="col-md-3 profile">
		    		<a href="task-list/5">
			    		<img src="/img/c2.svg" onClick={this.imageClick.bind(this, 6)}/>
			    		<h4>MCD</h4>
		    		</a>
		    	</div>
		    	<div className="col-md-3 profile">
		    		<a href="/govt/6">
			    		<img src="/img/c1.svg" onClick={this.imageClick.bind(this, 7)}/>
			    		<h4>DDA</h4>
		    		</a>
		    	</div>
		    	
		    </div>
		  </div>
		);
	}
}