// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

contract EtherWill {

    struct Clause {
        address to;
        uint amount; // in ether
    }

    address private admin;

    address private certifiedMiddlewares; //address of DeathCertificate contract

    mapping(address => Clause[]) /*private*/ public wills;

    mapping(string => address) /*private*/ public accounts;

    event ExecutedWill(address testator, Clause[] clauses);

    event Log(string func, address sender, uint value); //For logging money

    modifier isAdmin() {
        require(msg.sender == admin, "Caller is not admin!");
        _;
    }

    modifier isCertifiedMiddleware() {
        require(certifiedMiddlewares == msg.sender, "Caller is not certified Middleware!");
        _;
    }

    modifier isRegistered(string memory personalNIN) {
        require(accounts[personalNIN] != address(0), "Not registered!");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    receive() external payable {
        emit Log("receive", msg.sender, msg.value);
    }


    function getAdmin() public view returns(address) {
        return admin;
    }

    function getCertifiedMiddlewares() public view returns(address) {
        return certifiedMiddlewares;
    }

    // is it ok??? 
    function amIReggistered(string memory personalNIN) public view returns(bool) {
        return accounts[personalNIN] != address(0);
    }
    // Only the Dapp will call it
    function register(string memory personalNIN) public {
        require(accounts[personalNIN] == address(0), "Allready registered!");

        accounts[personalNIN] = msg.sender;
    }

    function addCertifiedMiddleware(address middleware) public isAdmin {
        certifiedMiddlewares = middleware;
    }

    function deleteWillTo(string memory personalNIN, address to) public payable isRegistered(personalNIN) {
        require(accounts[personalNIN] == msg.sender, "Not your NIN");

        // How much we need to transfer back to the user
        uint amountToReturn = 0;

        for (uint i = 0; i < wills[msg.sender].length; i++) {
            if (wills[msg.sender][i].to == to) {
                amountToReturn += wills[msg.sender][i].amount;

                uint length = wills[msg.sender].length;
                // Delete the clause
                wills[msg.sender][i] = wills[msg.sender][length - 1];
                wills[msg.sender].pop();
                i--; // To check if the last element also satisfy the removal condition
            }
        }
        // Not sure if we need to charge the user for the gas
        payable(msg.sender).transfer(amountToReturn * (1 ether));
    }

    function getMyWill() public view returns(Clause[] memory) {
        return wills[msg.sender];
    }

    function createWill(string memory personalNIN, Clause[] memory clauses) public payable isRegistered(personalNIN) {
        require(accounts[personalNIN] == msg.sender, "Not your NIN");

        // Check if the user has enough ETH
        uint willAmount = 0;
        for (uint i = 0; i < clauses.length; i++) {
            willAmount += clauses[i].amount;
        }
        require(msg.value >= willAmount * (1 ether), "Not enough ethers!");

        // Lock the will ethers in the smart contract
        // Check if without this is ok
        (bool sent, bytes memory data) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        // Add the will clauses
        for (uint i = 0; i < clauses.length; i++) {
            wills[msg.sender].push(clauses[i]);
        }
    }

    // Executes the wills of the dead person if they have an account
    // Triggered by the event listener  / other smart contract /
    function executeWills(string memory personalNIN) public payable isCertifiedMiddleware isRegistered(personalNIN) {
        Clause[] memory testatorWills = wills[accounts[personalNIN]];

        for (uint i = 0; i < testatorWills.length; i++) {
            payable(testatorWills[i].to).transfer(testatorWills[i].amount * (1 ether));
        }

        emit ExecutedWill(accounts[personalNIN], testatorWills);
    }
}
