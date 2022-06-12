// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract EtherWill {

    struct Clause {
        address to;
        uint amount; // in ether
    }

    address private admin;

    address private deathCertificateAddr;

    mapping(address => Clause[]) private wills;

    mapping(string => address) private accounts;

    event ExecutedWill(address testator, Clause[] clauses);

    event Log(string func, address sender, uint value); //For logging money

    modifier isAdmin() {
        require(tx.origin == admin, "Caller is not admin!");
        _;
    }

    modifier isDeathCertificateContract() {
        require(deathCertificateAddr == msg.sender, "Caller is not certified Middleware!");
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

    function getWills(address addr) public view returns(Clause[] memory) {
        return wills[addr];
    }

    function getAccount(string memory NIN) public view returns(address) {
        return accounts[NIN];
    }

    function getAdmin() public view returns(address) {
        return admin;
    }

    function getDeathCertificateAddr() public view returns(address) {
        return deathCertificateAddr;
    }

    // used for testing purposes
    function amIReggistered(string memory personalNIN) public view returns(bool) {
        return accounts[personalNIN] != address(0);
    }

    // Only the Dapp will call it
    function register(string memory personalNIN) public {
        require(accounts[personalNIN] == address(0), "Allready registered!");

        accounts[personalNIN] = msg.sender;
    }

    function setDeathSertificateAddr(address addr) public isAdmin {
        deathCertificateAddr = addr;
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

    // this is hack for ui
    function getMyWillTo() public view returns(address[] memory) {
        uint length = wills[msg.sender].length;
        address[] memory arr = new address[](length);
        for (uint256 index = 0; index < length; index++) {
            arr[index] = wills[msg.sender][index].to;
        }

        return arr;
    }

    function getMyWillAmount() public view returns(uint[] memory){
        uint length = wills[msg.sender].length;
        uint[] memory arr = new uint[](length);
        for (uint256 index = 0; index < length; index++) {
            arr[index] = wills[msg.sender][index].amount;
        }

        return arr;
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
        // Add the will clauses
        for (uint i = 0; i < clauses.length; i++) {
            wills[msg.sender].push(clauses[i]);
        }
    }

    // This is for ui only ... 
    function createWillUI(string memory personalNIN, address[] memory addresses, uint[] memory amounts) public payable isRegistered(personalNIN) {
        require(accounts[personalNIN] == msg.sender, "Not your NIN");

        Clause[] memory clauses = new Clause[](addresses.length);

        // Check if the user has enough ETH
        uint willAmount = 0;
        for (uint i = 0; i < clauses.length; i++) {
            clauses[i] = Clause({to: addresses[i], amount: amounts[i]});
            willAmount += amounts[i];
        }
        require(msg.value >= willAmount * (1 ether), "Not enough ethers!");

        // Lock the will ethers in the smart contract
        // Add the will clauses
        for (uint i = 0; i < clauses.length; i++) {
            wills[msg.sender].push(clauses[i]);
        }
    }

    // Executes the wills of the dead person if they have an account
    // Triggered by DeathSertificate contract
    function executeWills(string memory personalNIN) public payable isDeathCertificateContract isRegistered(personalNIN) {
        Clause[] memory testatorWills = wills[accounts[personalNIN]];

        // This can be optimized through grouping the wills by the receiver and executing them
        for (uint i = 0; i < testatorWills.length; i++) {
            payable(testatorWills[i].to).transfer(testatorWills[i].amount * (1 ether));
        }

        emit ExecutedWill(accounts[personalNIN], testatorWills);
    }
}
