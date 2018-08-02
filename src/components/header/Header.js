import React, { Component } from 'react';
import {
	Link
} from 'react-router-dom'

import './header.css'

class Header extends Component {
	render() {
		return (
			<div className="container">
	    		<h1>Ekatra by <b>Merkle Labs</b></h1>
	    		<p>For all civic complaints on the <b>Blockchain</b>.</p>
	    		<br/>
	    		<Link to={`/`} className="home-link">HOME</Link>
    		</div>
		);
	}
}

export default Header;

