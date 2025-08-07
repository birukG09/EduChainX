// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialRegistry {
    address public admin;

    struct Credential {
        string studentName;
        string institution;
        string course;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(address => Credential[]) public credentials;

    event CredentialIssued(address indexed student, string ipfsHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCredential(
        address student,
        string memory name,
        string memory institution,
        string memory course,
        string memory ipfsHash
    ) public onlyAdmin {
        credentials[student].push(Credential(name, institution, course, ipfsHash, block.timestamp));
        emit CredentialIssued(student, ipfsHash);
    }

    function getCredentials(address student) public view returns (Credential[] memory) {
        return credentials[student];
    }
}
