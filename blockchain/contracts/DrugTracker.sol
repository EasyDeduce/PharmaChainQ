// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DrugTracker {
    struct Batch {
        string id;
        string name;
        string origin;
        string composition;
        uint expiry;
        address currentOwner;
        bool isTampered;
    }

    mapping(string => Batch) public batches;

    function createBatch(string memory _id, string memory _name, string memory _origin, string memory _composition, uint _expiry) public {
        batches[_id] = Batch(_id, _name, _origin, _composition, _expiry, msg.sender, false);
    }

    function transferBatch(string memory _id, address _to) public {
        require(batches[_id].currentOwner == msg.sender, "Only current owner can transfer");
        batches[_id].currentOwner = _to;
    }

    function flagTamper(string memory _id) public {
        require(batches[_id].currentOwner != address(0), "Batch does not exist");
        require(batches[_id].currentOwner != msg.sender, "Owner cannot flag their own batch");
        batches[_id].isTampered = true;
    }

    // ✅ Getter to check batch owner
    function getBatchOwner(string memory _id) public view returns (address) {
        return batches[_id].currentOwner;
    }

    // ✅ Getter to check if batch is tampered
    function isBatchTampered(string memory _id) public view returns (bool) {
        return batches[_id].isTampered;
    }
}

