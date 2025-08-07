// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EduChainX {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyEducator() {
        require(educators[msg.sender], "Not an educator");
        _;
    }

    modifier onlyStudent() {
        require(students[msg.sender], "Not a student");
        _;
    }

    struct Certificate {
        string studentName;
        string courseName;
        string grade;
        uint256 issuedDate;
        address issuer;
        bool isValid;
    }

    mapping(bytes32 => Certificate) private certificates;
    mapping(address => bool) public educators;
    mapping(address => bool) public students;

    event EducatorAdded(address indexed educator);
    event EducatorRemoved(address indexed educator);
    event StudentRegistered(address indexed student);
    event CertificateIssued(bytes32 indexed certId, address indexed student, string courseName);
    event CertificateRevoked(bytes32 indexed certId);
    event CertificateVerified(bytes32 indexed certId, bool valid);

    // --- Role Management ---

    function addEducator(address _educator) public onlyOwner {
        educators[_educator] = true;
        emit EducatorAdded(_educator);
    }

    function removeEducator(address _educator) public onlyOwner {
        educators[_educator] = false;
        emit EducatorRemoved(_educator);
    }

    function registerStudent(address _student) public onlyOwner {
        students[_student] = true;
        emit StudentRegistered(_student);
    }

    // --- Certificate Management ---

    function issueCertificate(
        address studentAddr,
        string memory studentName,
        string memory courseName,
        string memory grade
    ) public onlyEducator returns (bytes32) {
        require(students[studentAddr], "Student not registered");

        bytes32 certId = keccak256(abi.encodePacked(studentAddr, courseName, block.timestamp));

        certificates[certId] = Certificate({
            studentName: studentName,
            courseName: courseName,
            grade: grade,
            issuedDate: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        emit CertificateIssued(certId, studentAddr, courseName);
        return certId;
    }

    function revokeCertificate(bytes32 certId) public onlyEducator {
        require(certificates[certId].isValid, "Already revoked or doesn't exist");
        certificates[certId].isValid = false;
        emit CertificateRevoked(certId);
    }

    function verifyCertificate(bytes32 certId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory grade,
        uint256 issuedDate,
        address issuer,
        bool isValid
    ) {
        Certificate memory cert = certificates[certId];
        return (
            cert.studentName,
            cert.courseName,
            cert.grade,
            cert.issuedDate,
            cert.issuer,
            cert.isValid
        );
    }

    function isCertificateValid(bytes32 certId) public view returns (bool) {
        emit CertificateVerified(certId, certificates[certId].isValid);
        return certificates[certId].isValid;
    }

    // --- Utility ---

    function getOwner() public view returns (address) {
        return owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
