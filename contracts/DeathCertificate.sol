// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "./EtherWill.sol";

contract DeathCertificate {
    struct Person {
        string NIN; // EGN in Bulgaria
        // more fields such as name, lastname, email can be added in the future
    }

    struct Document {
        Person announcer;
        Person dead;
        Person doctor;
    }

    address private admin;

    EtherWill private etherWillAddr;
    
    mapping(address => bool) private certifiedInstitustions;

    mapping(string => bool) private deadPeople;

    event Death(Document document);

    constructor(address payable _addr) {
        admin = msg.sender;
        etherWillAddr = EtherWill(_addr);
        etherWillAddr.setDeathSertificateAddr(address(this));
    }

    modifier isAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    modifier isCertifiedInstitution() {
        require(certifiedInstitustions[msg.sender], "Caller is not certified institution");
        _;
    }

    function addCertifiedInstitution(address institution) public isAdmin {
        certifiedInstitustions[institution] = true;
    }

    // How can we send data from web3.js, so we can use Document as a parameter type here
    function announceDeath(
        string memory announcerNIN,
        string memory deadNIN,
        string memory doctorNIN
    ) public isCertifiedInstitution {
        Person memory announcer = Person({NIN: announcerNIN});
        Person memory dead = Person({NIN: deadNIN });
        Person memory doctor = Person({NIN: doctorNIN});
    
        Document memory document = Document({ announcer: announcer, dead: dead, doctor: doctor });
        require(!deadPeople[document.announcer.NIN] && !deadPeople[document.dead.NIN], "Invalid document");
        deadPeople[document.dead.NIN] = true;

        emit Death(document);
        // call Wills smart contract to execute the wills of the dead person
        etherWillAddr.executeWills(document.dead.NIN);
    }
}
