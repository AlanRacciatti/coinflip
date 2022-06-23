import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { deployments, ethers } from "hardhat";
import { Coinflip, VRFCoordinatorV2Mock } from "../../typechain";
import { CoinflipUtils } from "./utils/index";

describe("Coinflip", function () {
  let coinflipContract: Coinflip,
    coinflipConsumer: Coinflip,
    otherCoinflipConsumer: Coinflip,
    vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
    deployer: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    alice = accounts[1];
    bob = accounts[2];

    await deployments.fixture(["main"]);

    coinflipContract = await ethers.getContract("Coinflip");
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

    coinflipConsumer = coinflipContract.connect(alice);
    otherCoinflipConsumer = coinflipContract.connect(bob);
  });

  it("Should be able to receive ETH", async () => {
    let balance: string;
    const bet: string = "0.1";

    balance = await CoinflipUtils.getParsedBalance(coinflipContract);

    assert(balance === "0.0");

    balance = await CoinflipUtils.fundContract(bet, coinflipContract, alice);

    assert(balance === bet);
  });

  it("Should send betted ETH * 2 if the player won", async () => {
    const bet: string = "0.01";
    let hasWon: boolean = false;

    while (!hasWon) {
      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      const tx: ContractTransaction = await coinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      });

      const requestId: number = await CoinflipUtils.getVrfRequestId(tx);

      const parsedConsumerBalancePreCoinflip: BigNumber =
        ethers.utils.parseEther(await CoinflipUtils.getParsedBalance(alice));

      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        coinflipContract.address
      );

      hasWon = await CoinflipUtils.checkHasWon(coinflipContract, requestId);

      if (hasWon) {
        const parsedConsumerBalanceAfterCoinflip: BigNumber =
          ethers.utils.parseEther(await CoinflipUtils.getParsedBalance(alice));

        const expectedPrize: BigNumber = ethers.utils
          .parseEther(bet)
          .mul(BigNumber.from(2));
        const expectedBalance: BigNumber =
          parsedConsumerBalancePreCoinflip.add(expectedPrize);

        expect(parsedConsumerBalanceAfterCoinflip).to.equal(expectedBalance);
      }
    }
  });

  it("Should NOT allow players to bet more ETH than the contract can handle", async () => {
    const bet: string = "0.01";

    await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

    await coinflipConsumer.requestCoinflip({
      value: ethers.utils.parseEther(bet),
    });

    await expect(
      otherCoinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      })
    ).to.be.revertedWith("InsufficientContractFunds");
  });

  it("Should NOT allow players to play without betting", async () => {
    await expect(coinflipConsumer.requestCoinflip()).to.be.revertedWith(
      "NoBetSent"
    );
  });

  it("Should NOT allow players to play if they have a coinflip in course", async () => {
    const bet: string = "0.01";

    for (let i = 0; i < 2; i++) {
      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);
    }

    await coinflipConsumer.requestCoinflip({
      value: ethers.utils.parseEther(bet),
    });

    await expect(
      coinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      })
    ).to.be.revertedWith("CoinflipInCourse");
  });

  it("Should return all bets", async () => {
    const bet: string = "0.01";

    for (let i = 0; i < 3; i++) {
      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      const tx: ContractTransaction = await coinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      });

      const requestId: number = await CoinflipUtils.getVrfRequestId(tx);

      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        coinflipContract.address
      );
    }

    const allBets = await coinflipContract.getAllBets();

    expect(allBets.length).to.equal(3);

    allBets.forEach((contractBet) => {
      expect(contractBet.player).to.equal(alice.address);
      expect(contractBet.bet).to.equal(ethers.utils.parseEther(bet));
    });
  });
});
