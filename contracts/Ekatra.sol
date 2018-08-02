pragma solidity ^0.4.24;

import "./BasicComplaint.sol";

interface GovtEntity {
    function giveRewards(address account, int reward) external;
}

contract Ekatra is BasicComplaint {

	mapping(bytes32 => Complaint) public _registry;
	GovtEntity govtEntity;

	event ComplaintHash(bytes32 hash, address complainant);
	event NewComplaintEvent(bytes32 hash, uint lat, uint long);
	event NewTaskEvent(bytes32 complaintHash, uint taskId, address govtEntityAddress);

	function initGovtEntity(address contractAddress) public {
		govtEntity = GovtEntity(contractAddress);
	}

	function registerComplaint(
		string title,
		string description,
		uint lat,
		uint long,
		address govtEntityAddress
	) public {

		bytes32 hash = keccak256( abi.encodePacked(
			title,
			description, 
			lat, 
			long, 
			govtEntityAddress,
			now
		));

		Complaint storage complaint = _registry[hash];

		Location storage location = _registry[hash]._location;

		complaint._complainantAddress = msg.sender;
		complaint._title = title;
		complaint._description = description;
		complaint._status = Status.Open;

		location._lat = lat;
		location._long = long;

		complaint._signersList.push(msg.sender);
		complaint._signerListValidation[msg.sender] = true;

		Task memory task;
		task._title = "Assign POC";
		task._description = "Assign a person from your department to look into this issue";
		task._govtEntityAddress = govtEntityAddress;
		task._reward = 100;
		task._timeStamps[0] = now;
		task._timeStamps[1] = 2; 		// 4 days
		task._timeStamps[2] = now;
		task._timeStamps[4] = now + 1;
		task._status = Status.Ongoing;

		complaint._taskList.push(task);

		emit ComplaintHash(hash, msg.sender);
		emit NewComplaintEvent(hash, lat, long);
		emit NewTaskEvent(hash, 0, govtEntityAddress);
	}

	function addTask(
		bytes32 complaintHash,
		string title,
		string description,
		address govtEntityAddress
	) public {

		Task memory task;
		task._title = title;
		task._description = description;
		task._govtEntityAddress = govtEntityAddress;
		task._reward = 100;
		task._timeStamps[4] = now + RESPONSE_DEADLINE;
		task._status = Status.Open;

		if(_registry[complaintHash]._taskList[_registry[complaintHash]._taskList.length - 1]._status == Status.Open) {
			_registry[complaintHash]._taskList[_registry[complaintHash]._taskList.length - 1]._status = Status.Ongoing;
		} else {
			_registry[complaintHash]._taskList[_registry[complaintHash]._taskList.length - 1]._status = Status.UnderReview;
			_registry[complaintHash]._taskList[_registry[complaintHash]._taskList.length - 1]._timeStamps[3] = now;
		}

		_registry[complaintHash]._taskList.push(task);

		emit NewTaskEvent(
			complaintHash,
			_registry[complaintHash]._taskList.length - 1,
			govtEntityAddress
		);
	}

	function getTask(
		bytes32 complaintHash,
		uint taskId
	) 
		public
		view
		returns(
			string title,
			string description,
			address govtEntityAddress,
			int reward,
			uint[5] timestamps,
			Status status
		)
	{
		return(
			_registry[complaintHash]._taskList[taskId]._title,
			_registry[complaintHash]._taskList[taskId]._description,
			_registry[complaintHash]._taskList[taskId]._govtEntityAddress,
			_registry[complaintHash]._taskList[taskId]._reward,
			_registry[complaintHash]._taskList[taskId]._timeStamps,
			_registry[complaintHash]._taskList[taskId]._status
		);
	}

	function updateTaskStatus(
		bytes32 complaintHash,
		uint taskId, 
		Status status
	) public {
		assert(status < Status.Closed);

		if(status == Status.Ongoing) {
			_registry[complaintHash]._taskList[taskId]._timeStamps[2] = now;
		}
		_registry[complaintHash]._taskList[taskId]._status = status;
	}

	function startTask(
		bytes32 complaintHash,
		uint taskId
	)
		public
	{
		assert(_registry[complaintHash]._taskList[taskId]._status == Status.Viewed);

		uint correctTimestamp = _registry[complaintHash]._taskList[taskId - 1]._timeStamps[3] + _registry[complaintHash]._taskList[taskId]._timeStamps[0];
		if(now > correctTimestamp) {
			uint penalty = ((correctTimestamp - uint(now)) * 100) / _registry[complaintHash]._taskList[taskId]._timeStamps[0];
		
			_registry[complaintHash]._taskList[taskId]._reward = _registry[complaintHash]._taskList[taskId]._reward - int(penalty);
		}

		_registry[complaintHash]._taskList[taskId]._status = Status.Ongoing;
		_registry[complaintHash]._taskList[taskId]._timeStamps[2] = now;
	}

	function updateTaskDetails(
		bytes32 complaintHash,
		uint taskId,
		uint expectedStartTimestamp,
		uint expectedDurationTimestamp
	) public {
		
		if(now > _registry[complaintHash]._taskList[taskId]._timeStamps[4]) {
			uint penalty = ((_registry[complaintHash]._taskList[taskId]._timeStamps[4] - now) * 100) / RESPONSE_DEADLINE;
		
			_registry[complaintHash]._taskList[taskId]._reward = _registry[complaintHash]._taskList[taskId]._reward - int(penalty);
		}

		_registry[complaintHash]._taskList[taskId]._timeStamps[0] = expectedStartTimestamp;
		_registry[complaintHash]._taskList[taskId]._timeStamps[1] = expectedDurationTimestamp;

		_registry[complaintHash]._taskList[taskId]._status = Status.Viewed;
	}

	function endTask(
		bytes32 complaintHash,
		uint taskId
	) 
		public
		returns(bool) 
	{
		if(checkReviewSuccess(complaintHash, taskId)) {
			// TODO: add reward to dept.
			uint expectedEnd = _registry[complaintHash]._taskList[taskId]._timeStamps[1] + _registry[complaintHash]._taskList[taskId]._timeStamps[2];
			if(expectedEnd > _registry[complaintHash]._taskList[taskId]._timeStamps[3]) {
				uint penalty = ((_registry[complaintHash]._taskList[taskId]._timeStamps[3] - expectedEnd) * 100) / _registry[complaintHash]._taskList[taskId]._timeStamps[1];
			
				_registry[complaintHash]._taskList[taskId]._reward = _registry[complaintHash]._taskList[taskId]._reward - int(penalty);
			}

			govtEntity.giveRewards(
				_registry[complaintHash]._taskList[taskId]._govtEntityAddress,
				_registry[complaintHash]._taskList[taskId]._reward
			);

			// if assert fails notify the user that not enough review.
			_registry[complaintHash]._taskList[taskId]._status = Status.Closed;

			if(_registry[complaintHash]._taskList.length - 1 == taskId) {
				_registry[complaintHash]._status = Status.Closed;
			}

			return true;
		} else {
			return false;
		}
		
	}

	function lastTask(
		bytes32 complaintHash,
		uint taskId
	) public {
		_registry[complaintHash]._taskList[taskId]._status = Status.UnderReview;
		_registry[complaintHash]._taskList[taskId]._timeStamps[3] = now;
	}

	function addExpectedDurationTime(
		bytes32 complaintHash,
		uint taskId,
		uint expectedDurationTimestamp
	) public {
		assert(_registry[complaintHash]._taskList[taskId]._govtEntityAddress == msg.sender);
		_registry[complaintHash]._taskList[taskId]._timeStamps[1] = expectedDurationTimestamp;
	}

	function endComplaint(bytes32 complaintHash) public {
		for(uint i = 0; i < _registry[complaintHash]._taskList.length; i++) {
			if(endTask(complaintHash, i) == false) {
				return;
			}
		}

		_registry[complaintHash]._status = Status.Closed;
	}

	function checkReviewSuccess(
		bytes32 complaintHash,
		uint taskId
	) private view returns(bool) {
		return((_registry[complaintHash]._taskList[taskId]._review._sumReviewPoints * 100) /
			_registry[complaintHash]._taskList[taskId]._review._totalReviewPoints >= REVIEW_SUCCESS);
	}

	function addSigner(bytes32 complaintHash) public {
		if(_registry[complaintHash]._signerListValidation[msg.sender] == false) {
			_registry[complaintHash]._signersList.push(msg.sender);
			_registry[complaintHash]._signerListValidation[msg.sender] = true;
		}
	}

	// reward related functions

	function reviewTask(
		bytes32 complaintHash,
		uint taskId,
		uint reward
	) public {
		if(	_registry[complaintHash]._taskList[taskId]._govtEntityAddress != msg.sender &&
				_registry[complaintHash]._taskList[taskId]._reviewValidation[msg.sender] == false &&
				reward <= REWARD_POINTS) {
			
			_registry[complaintHash]._taskList[taskId]._review._sumReviewPoints += reward;
			_registry[complaintHash]._taskList[taskId]._review._totalReviewPoints += REWARD_POINTS;
			_registry[complaintHash]._taskList[taskId]._reviewValidation[msg.sender] = true;
		}
		
	}

	function getReview(
		bytes32 complaintHash,
		uint taskId
	) 
		public 
		view
		returns(
			uint sum,
			uint total
		)
	{
		return(
			_registry[complaintHash]._taskList[taskId]._review._sumReviewPoints,
			_registry[complaintHash]._taskList[taskId]._review._totalReviewPoints
		);
	}

	function getComplaint(bytes32 complaintHash) public view returns(
		string title,
		string description,
		uint taskListLength,
		address[] signerList,
		Status status
	) {
		return(
			_registry[complaintHash]._title,
			_registry[complaintHash]._description,
			_registry[complaintHash]._taskList.length,
			_registry[complaintHash]._signersList,
			_registry[complaintHash]._status
		);
	}

	// distribute reward function.
}
