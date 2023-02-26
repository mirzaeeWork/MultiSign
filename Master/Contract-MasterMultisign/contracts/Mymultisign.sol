// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MasterMultiSigWallet {
    using ECDSA for bytes32;
    struct Transaction {
        uint256 id;
        address admin;
        bool executed;
        address payable destination;
        uint256 value;
        bytes data;
    }

    uint256 public required;
    uint256 public transactionCount;

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) isOwnerForTransactions;
    mapping(address => uint256[]) showCountTransaction;
    mapping(uint256 => uint256) requireds;
    mapping(uint256 => uint256) countOwners;
    mapping(uint256 => mapping(address => bool)) confirmations;
    mapping(uint256 => address[]) owners;
    mapping(address => uint256[]) IdsSign;

    event Submission(uint256 indexed transactionId);
    event Owner(uint256 _transactionId, address _owner);
    event DeleteOwner(address indexed _oldSigner, bool);
    event Execution(uint256 indexed transactionId, bool);
    event Confirmation(address indexed sender, uint256 indexed transactionId);

    function getIdsSign() public view returns (uint256[] memory) {
        return IdsSign[msg.sender]; 
    }

    function getShowCountTransaction() public view returns (uint256[] memory) {
        return showCountTransaction[msg.sender];
    }

    function BytesToString(
        bytes memory _by
    ) public pure returns (string memory) {
        string memory st = string(_by);
        return st;
    }

    function getTransaction(
        uint256[] memory _ID
    ) public view returns (Transaction[] memory) {
        Transaction[] memory list = new Transaction[](_ID.length);
        if (_ID.length > 0) {
            for (uint i = 0; i < _ID.length; i++) {
                list[i] = transactions[_ID[i]];
            }
        }
        return list;
    }

    function getOwners(
        uint256 transactionId
    ) public view returns (address[] memory) {
        return owners[transactionId];
    }

    function getIsOwnerForTransactions(
        uint256 transactionId,
        address _owner
    ) public view returns (bool) {
        return isOwnerForTransactions[transactionId][_owner];
    }

    function getConfirmations(
        uint256 transactionId,
        address _owner
    ) public view returns (bool) {
        return confirmations[transactionId][_owner];
    }

    function getRequireds(uint256 transactionId) public view returns (uint256) {
        return requireds[transactionId];
    }

    function getCountOwners(
        uint256 transactionId
    ) public view returns (uint256) {
        return countOwners[transactionId];
    }

    function AddTransaction(
        address payable destination,
        bytes memory data
    ) public payable {
        require(msg.value > 0, "Eth not Zero");
        uint256 transactionId = transactionCount;
        require(msg.sender != address(0), "address zero");
        require(destination != address(0), "address zero");
        transactions[transactionId] = Transaction({
            id: transactionId,
            admin: msg.sender,
            destination: destination,
            value: msg.value,
            data: data,
            executed: false
        });
        showCountTransaction[msg.sender].push(transactionId);
        transactionCount++;
        emit Submission(transactionId);
    }

    function addSigner(uint256 transactionId, address _owner) public {
        Transaction memory _trans = transactions[transactionId];
        require(_trans.admin == msg.sender, "not admin");
        require(_owner != address(0), "MetaMultiSigWallet: zero address");
        require(
            !isOwnerForTransactions[transactionId][_owner],
            "MetaMultiSigWallet: owner not unique"
        );
        isOwnerForTransactions[transactionId][_owner] = true;
        owners[transactionId].push(_owner);
        IdsSign[_owner].push(transactionId);
        requireds[transactionId] += 1;
        emit Owner(transactionId, _owner);
    }

    function removeSigner(uint256 transactionId, address oldSigner) public {
        Transaction memory _trans = transactions[transactionId];
        require(_trans.admin == msg.sender, "not admin");

        require(
            isOwnerForTransactions[transactionId][oldSigner],
            "removeSigner: owner is not"
        );
        isOwnerForTransactions[transactionId][oldSigner] = false;
        for (uint i = 0; i < owners[transactionId].length; i++) {
            if (owners[transactionId][i] == oldSigner)
                delete owners[transactionId][i];
        }
        for (uint i = 0; i < IdsSign[oldSigner].length; i++) {
            if (IdsSign[oldSigner][i] == transactionId)
                delete IdsSign[oldSigner][i];
        }

        requireds[transactionId]--;

        emit DeleteOwner(
            oldSigner,
            isOwnerForTransactions[transactionId][oldSigner]
        );
    }

    function getTransactionHash(
        uint256 transactionId
    ) public view returns (bytes32) {
        Transaction memory _trans = transactions[transactionId];
        require(
            isOwnerForTransactions[transactionId][msg.sender],
            "owner is not"
        );
        return
            keccak256(
                abi.encodePacked(
                    address(this),
                    _trans.admin,
                    _trans.destination,
                    _trans.value,
                    _trans.data,
                    msg.sender
                )
            );
    }

    function confirmTransaction(
        uint256 transactionId,
        bytes memory signatures
    ) public {
        bytes32 _hash = getTransactionHash(transactionId);
        address recovered = recover(_hash, signatures);
        require(recovered == msg.sender, "The signature is wrong");
        require(
            !confirmations[transactionId][msg.sender],
            "confirmations is true"
        );
        confirmations[transactionId][msg.sender] = true;
        countOwners[transactionId]++;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }

    function recover(
        bytes32 _hash,
        bytes memory _signature
    ) public pure returns (address) {
        return _hash.toEthSignedMessageHash().recover(_signature);
    }

    function executeTransaction(uint256 transactionId) internal {
        require(
            !transactions[transactionId].executed,
            "Transaction transfer done"
        );
        if (isConfirmed(transactionId)) {
            Transaction storage _trans = transactions[transactionId]; // using the "storage" keyword makes "t" a pointer to storage
            _trans.executed = true;
            (bool success, ) = _trans.destination.call{value: _trans.value}(
                _trans.data
            );
            if (success) {
                emit Execution(transactionId, success);
            } else {
                emit Execution(transactionId, success);
                _trans.executed = false;
            }
        } else {
            emit Execution(transactionId, false);
        }
    }

    function isConfirmed(uint256 transactionId) internal view returns (bool) {
        if (countOwners[transactionId] == requireds[transactionId]) {
            return true;
        }
        return false;
    }
}
