pragma solidity ^0.4.24;

contract GovtEntity {

	// can represent people in a department.
	mapping(address => address[]) _entityStakeholders;

	// holds name and reward associated.
	struct Entity {
		string _name;
		int _reward;
	}

	mapping(address => Entity) _registry;

	function registerName(string name) public {
		_registry[msg.sender]._name = name;
	}

	function getReward() public view returns(int reward) {
		return(_registry[msg.sender]._reward);
	}

	function getDetails() public view returns(string name, int reward) {
		return(_registry[msg.sender]._name, _registry[msg.sender]._reward);
	}

	// 'public' not safe
	function giveRewards(address account, int reward) public {
		_registry[account]._reward += reward;
	}

	// Add consolidated reward points.
}
