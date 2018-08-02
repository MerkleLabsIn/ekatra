pragma solidity ^0.4.24;

contract BasicComplaint {

	enum Status { Open, Viewed, Ongoing, UnderReview, Closed }

	uint constant REWARD_POINTS = 10;
	uint constant REVIEW_SUCCESS = 60;
	uint constant RESPONSE_DEADLINE = 2 days; 		// 2 days
	
	struct Location {
		uint _lat;
		uint _long;
	}

	struct ExternalResources {
		string[] _ipfs;
	}

	struct Review {
		uint _sumReviewPoints;
		uint _totalReviewPoints;
	}

	struct Task {
		string _title;
		string _description;
		address _govtEntityAddress;
		int _reward;
		uint[5] _timeStamps;						// 0:_expectedStartTimestamp 1:_expectedDurationTimestamp 2:_actualStartTimestamp 3:_actualEndTimestamp 4: _responseDeadline
		Review _review;
		mapping(address => bool) _reviewValidation;
		Status _status;
	}

	struct Complaint {
		address _complainantAddress;
		Location _location;
		string _title;
		string _description;
		ExternalResources _external_resources;
		Task[] _taskList;
		address[] _signersList;
		mapping(address => bool) _signerListValidation;
		Status _status;
	}
}
