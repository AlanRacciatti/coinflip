import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractTransaction } from "ethers";
import { deployments, ethers, network } from "hardhat";
import { Coinflip, VRFCoordinatorV2Mock } from "../../typechain";
import { CoinflipUtils } from "../utils/index";
import { developmentChains } from "../../helper-hardhat-config";

if (developmentChains.includes(network.name)) {
  describe("VRF Coordinator", function () {
    let coinflipContract: Coinflip,
      coinflipConsumer: Coinflip,
      vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
      deployer: SignerWithAddress,
      alice: SignerWithAddress,
      accounts: SignerWithAddress[];

    beforeEach(async () => {
      accounts = await ethers.getSigners();
      deployer = accounts[0];
      alice = accounts[1];

      await deployments.fixture(["main"]);

      coinflipContract = await ethers.getContract("Coinflip");
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

      coinflipConsumer = coinflipContract.connect(alice);
    });

    it("Should emit an event when requesting randomness", async () => {
      const bet: string = "0.01";

      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      await expect(
        coinflipConsumer.requestCoinflip({
          value: ethers.utils.parseEther(bet),
        })
      ).to.emit(coinflipContract, "RandomnessRequested");
    });

    it("Should successfully receive the request", async () => {
      const bet: string = "0.01";

      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      await expect(
        coinflipConsumer.requestCoinflip({
          value: ethers.utils.parseEther(bet),
        })
      ).to.emit(vrfCoordinatorV2Mock, "RandomWordsRequested");
    });

    it("Should fulfill Random Number request", async () => {
      const bet: string = "0.01";

      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      const tx: ContractTransaction = await coinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      });

      const requestId: number = await CoinflipUtils.getVrfRequestId(tx);

      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(
          requestId,
          coinflipContract.address
        )
      ).to.emit(vrfCoordinatorV2Mock, "RandomWordsFulfilled");
    });

    it("Should emit an event after coinflip ends", async () => {
      const bet: string = "0.01";

      await CoinflipUtils.fundContract(bet, coinflipContract, deployer);

      const tx: ContractTransaction = await coinflipConsumer.requestCoinflip({
        value: ethers.utils.parseEther(bet),
      });

      const requestId: number = await CoinflipUtils.getVrfRequestId(tx);

      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(
          requestId,
          coinflipContract.address
        )
      ).to.emit(coinflipContract, "CoinflipEnd");
    });
  });
}
