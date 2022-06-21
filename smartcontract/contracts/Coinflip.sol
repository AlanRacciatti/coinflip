// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Coinflip is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface public COORDINATOR;

    struct Bet {
        address player;
        uint256 bet;
    }

    uint64 private immutable s_subscriptionId;
    bytes32 private immutable keyHash;
    uint32 private constant callbackGasLimit = 100000;
    uint16 private constant requestConfirmations = 3;
    uint32 private constant numWords = 2;

    uint256 public s_requestId;

    mapping(uint256 => Bet) public requestIdToBet;

    event randomnessRequested(uint256 requestId);
    event coinflipEnd(uint256 requestId, Bet bet, bool didWin);

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
        require(msg.value > 0, "No bet received");

        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        requestIdToBet[s_requestId] = Bet(msg.sender, msg.value);

        emit randomnessRequested(s_requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        bool hasWin = (randomWords[0] % 2 == 0);
        Bet storage winnerBet = requestIdToBet[requestId];

        if (hasWin) {
            payable(winnerBet.player).transfer(winnerBet.bet);
            emit coinflipEnd(requestId, winnerBet, hasWin);
        } else {
            emit coinflipEnd(requestId, winnerBet, hasWin);
        }
    }
}
