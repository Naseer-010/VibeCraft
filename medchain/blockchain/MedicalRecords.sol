// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalRecords {

    struct Record {
        address patient;
        address doctor;
        string ipfsCID;
        string fileHash;
        uint256 timestamp;
    }

    Record[] public records;

    event RecordAdded(
        uint256 indexed recordId,
        address indexed patient,
        address indexed doctor,
        string ipfsCID,
        string fileHash
    );

    function addRecord(
        address _patient,
        address _doctor,
        string memory _ipfsCID,
        string memory _fileHash
    ) public {
        records.push(
            Record(
                _patient,
                _doctor,
                _ipfsCID,
                _fileHash,
                block.timestamp
            )
        );

        emit RecordAdded(
            records.length - 1,
            _patient,
            _doctor,
            _ipfsCID,
            _fileHash
        );
    }

    function getRecord(uint256 _id) public view returns (Record memory) {
        return records[_id];
    }
}
