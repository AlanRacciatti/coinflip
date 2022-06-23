// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error NoBetSent();
error CoinflipInCourse();
error InsufficientContractFunds();

contract Coinflip is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface public COORDINATOR;

    struct Bet {
        address player;
        uint256 bet;
        bool didWin;
    }

    uint64 private immutable s_subscriptionId;
    uint256 private s_requestId;
    bytes32 private immutable keyHash;
    uint32 private constant callbackGasLimit = 100000;
    uint16 private constant requestConfirmations = 3;
    uint32 private constant numWords = 2;

    uint256 private ethToSend;
    mapping(uint256 => Bet) public requestIdToBet;
    mapping(address => bool) private userToCoinflip;

    event RandomnessRequested(uint256 requestId);
    event CoinflipEnd(uint256 requestId, Bet bet, bool didWin);

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
    }

    function requestCoinflip() external payable {
        if (msg.value == 0) {
            revert NoBetSent();
        }

        if ((ethToSend + msg.value * 2) > address(this).balance) {
            revert InsufficientContractFunds();
        }

        if (userToCoinflip[msg.sender]) {
            revert CoinflipInCourse();
        }

        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        requestIdToBet[s_requestId] = Bet(msg.sender, msg.value, false);
        userToCoinflip[msg.sender] = true;
        ethToSend += msg.value * 2;

        emit RandomnessRequested(s_requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        bool hasWin = (randomWords[0] % 2 == 0);
        Bet storage playerBet = requestIdToBet[requestId];

        if (hasWin) {
            payable(playerBet.player).transfer(playerBet.bet * 2);
            playerBet.didWin = true;
            emit CoinflipEnd(requestId, playerBet, hasWin);
        } else {
            emit CoinflipEnd(requestId, playerBet, hasWin);
        }

        userToCoinflip[playerBet.player] = false;
        ethToSend -= playerBet.bet * 2;
    }

    function getAllBets() public view returns (Bet[] memory) {
        Bet[] memory allBets = new Bet[](s_requestId);
        for (uint256 i = 0; i < s_requestId; i++) {
            allBets[i] = requestIdToBet[i + 1];
        }
        return allBets;
    }

    receive() external payable {}
}
