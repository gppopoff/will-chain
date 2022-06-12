// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

import "./EtherWill.sol";

contract DeathCertificate {
    struct Person {
        string NIN; // EGN in Bulgaria
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

    // The event for the event listener
    event Death(Document document);

    constructor(address payable _addr) {
        admin = msg.sender;
        etherWillAddr = EtherWill(_addr);
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

    function announceDeath(Document memory document) public isCertifiedInstitution {
        require(!deadPeople[document.announcer.NIN] && !deadPeople[document.dead.NIN], "Invalid document");
        deadPeople[document.dead.NIN] = true;

        emit Death(document);
        etherWillAddr.executeWills(document.dead.NIN);
        // call Wills smart contract
    }
}