import React, { Component } from 'react'
import {
BrowserRouter as Router,
Route,
Link
} from 'react-router-dom'

import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import Header from './components/header/Header'

import Home from './components/pages/home/Home'
import Register from './components/pages/register/Register'
import ComplaintList from './components/pages/list/ComplaintList'
import ComplaintDetails from './components/pages/details/ComplaintDetails'
import GovtDept from './components/pages/dept/GovtDept'

import TaskList from './components/pages/list/TaskList'


class App extends Component {
    constructor(props) {
        super(props)

        /*this.state = {
            reqDataPromise: null,
            'web3': null,
            'utility': null,
            'notification': ''
        }

        this.utility = null;

        this.updateNotify = this.updateNotify.bind(this);*/
    }

    /*updateNotify(val) {
        this.setState({
            'notification': val
        })
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        console.log('mount')

        this.state.reqDataPromise = new Promise((resolve, reject) => {
            getWeb3.then(results => {
                
                console.log('now')
                this.state.web3 = results.web3
                console.log(results.web3)
                window.web3 = results.web3
                // Instantiate contract once web3 provided.
                this.instantiateContract().then(conIns => {
                    console.log('responsed')
                    console.log(conIns)
                    resolve({'web3':results.web3, 'contract':conIns})
                })
                .catch(() => {
                    console.log('err')
                })
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
        })

        this.state.utility = new Utility(this.state.reqDataPromise, this.updateNotify)
        console.log(this.state)
    }

instantiateContract() {
    
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     

    const contract = require('truffle-contract')
    const OCNContract = contract(OpenComplaintNetworkContract)
    OCNContract.setProvider(this.state.web3.currentProvider)
    OCNContract.setNetwork(5777)
    console.log('ttt')
    console.log(this.state.web3)
    window.OCN = OCNContract

    var self = this
    return new Promise( (resolve, reject) => {
        OCNContract.deployed().then((instance) => {
            console.log("helllllo")
            var cont = new self.state.web3.eth.Contract(instance.abi, instance.address);
            resolve(cont)
            
        })  
    })

}*/

render() {
return (
    <Router>
        <div className="App">
            <Header />
            <Route exact path="/" component={Home} />
            <Route path='/register/:id' component={Register}/>
            <Route path='/list/:id' component={ComplaintList}/>
            <Route path='/complaint-details/:id/:cid' component={ComplaintDetails}/>
            
            <Route path='/task-list/:id' component={TaskList}/>
            <Route path='/govt/:id' component={GovtDept}/>
            {/*<Route extact path='/Manager' render={(props) => ( <Manager utilityObj={this.state.utility} /> )} />
            <Route extact path='/Citizen/:id' render={(props) => ( <Citizen utilityObj={this.state.utility} /> )} />

            <Route extact path='/Accounts' render={(props) => ( <Accounts contractObject={this.state.contractInstance} web3Obj={this.state.web3} /> )} />
            <div className="notification alert alert-success" role="alert">{this.state.notification}</div>*/}
        </div>
    </Router>
  );
}
}

export default App
