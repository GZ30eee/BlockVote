// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Election {
    struct Candidate {
        string name;
        string party;
        uint256 voteCount;
    }
    
    struct ElectionData {
        string title;
        string description;
        uint256 endTime;
        uint256 totalVotes;
        bool isActive;
        address creator;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => ElectionData) public elections;
    uint256 public electionCount;
    
    event ElectionCreated(uint256 indexed electionId, address indexed creator, string title);
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);
    
    modifier onlyBeforeEnd(uint256 electionId) {
        require(block.timestamp < elections[electionId].endTime, "Election has ended");
        _;
    }
    
    modifier onlyActiveElection(uint256 electionId) {
        require(elections[electionId].isActive, "Election is not active");
        _;
    }
    
    modifier hasNotVoted(uint256 electionId) {
        require(!elections[electionId].hasVoted[msg.sender], "Already voted in this election");
        _;
    }
    
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _endTime,
        string[] memory _candidateNames,
        string[] memory _candidateParties
    ) public returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(_candidateNames.length > 1, "Election must have at least 2 candidates");
        require(_candidateNames.length == _candidateParties.length, "Candidate names and parties must match");
        
        uint256 electionId = electionCount;
        ElectionData storage election = elections[electionId];
        
        election.title = _title;
        election.description = _description;
        election.endTime = _endTime;
        election.isActive = true;
        election.creator = msg.sender;
        
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            election.candidates[i] = Candidate({
                name: _candidateNames[i],
                party: _candidateParties[i],
                voteCount: 0
            });
            election.candidateCount++;
        }
        
        electionCount++;
        
        emit ElectionCreated(electionId, msg.sender, _title);
        
        return electionId;
    }
    
    function vote(uint256 _electionId, uint256 _candidateId) 
        public 
        onlyActiveElection(_electionId)
        onlyBeforeEnd(_electionId)
        hasNotVoted(_electionId)
    {
        require(_candidateId < elections[_electionId].candidateCount, "Invalid candidate");
        
        elections[_electionId].candidates[_candidateId].voteCount++;
        elections[_electionId].totalVotes++;
        elections[_electionId].hasVoted[msg.sender] = true;
        
        emit VoteCast(_electionId, _candidateId, msg.sender);
    }
    
    function endElection(uint256 _electionId) public {
        require(msg.sender == elections[_electionId].creator, "Only creator can end election");
        elections[_electionId].isActive = false;
    }
    
    function getElection(uint256 _electionId) public view returns (
        string memory title,
        string memory description,
        uint256 endTime,
        uint256 totalVotes,
        bool isActive
    ) {
        ElectionData storage election = elections[_electionId];
        return (
            election.title,
            election.description,
            election.endTime,
            election.totalVotes,
            election.isActive
        );
    }
    
    function getCandidate(uint256 _electionId, uint256 _candidateId) public view returns (
        string memory name,
        string memory party,
        uint256 voteCount
    ) {
        require(_candidateId < elections[_electionId].candidateCount, "Invalid candidate");
        Candidate storage candidate = elections[_electionId].candidates[_candidateId];
        return (
            candidate.name,
            candidate.party,
            candidate.voteCount
        );
    }
    
    function getCandidateCount(uint256 _electionId) public view returns (uint256) {
        return elections[_electionId].candidateCount;
    }
    
    function hasVoted(uint256 _electionId, address _voter) public view returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }
}
