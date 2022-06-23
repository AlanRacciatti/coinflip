import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers, network } from "hardhat";
import { Coinflip } from "../../typechain";
import { developmentChains } from "../../helper-hardhat-config";
import { CoinflipUtils } from "../utils/index";
import { ContractTransaction } from "ethers";
import { expect } from "chai";

if (!developmentChains.includes(network.name)) {
  describe("Coinflip", function () {
    let coinflipContract: Coinflip,
      coinflipConsumer: Coinflip,
      deployer: SignerWithAddress,
      accounts: SignerWithAddress[];

    beforeEach(async () => {
      accounts = await ethers.getSigners();
      deployer = accounts[0];

      coinflipContract = await ethers.getContract("Coinflip");
      coinflipConsumer = coinflipContract.connect(deployer);
    });

    it("Should successfully request a random number", async () => {
      const bet: string = "0.001";

      const contractBalance: string = await CoinflipUtils.getParsedBalance(
        coinflipContract
      );

      if (
        ethers.utils
          .parseEther(contractBalance)
          .lt(ethers.utils.parseEther(bet))
      ) {
        console.log("-----------------------------------------");

        console.log(
          `Insufficient contract balance to test it, funding it with ${bet} ETH...`
        );

        console.log(
          `Contract balance: ${ethers.utils.parseEther(contractBalance)}`
        );

        console.log(`Balance required: ${ethers.utils.parseEther(bet)}`);

        console.log("-----------------------------------------");

        await CoinflipUtils.fundContract(bet, coinflipContract, deployer);
      }

      console.log("Requesting coinflip...");

      const requestCoinflipTx: ContractTransaction =
        await coinflipConsumer.requestCoinflip({
          value: ethers.utils.parseEther(bet),
        });

      await requestCoinflipTx.wait();

      console.log(
        "Coinflip successfully requested, waiting until randomness fulfillment"
      );

      console.log("-------------------------------------------------");

      expect(await coinflipContract.userToCoinflip(deployer.address)).to.equal(
        true
      );

      // Give the oracle some minutes to update the random number
      console.log("Waiting 3 minutes for the oracle to fullfill randomness");
      await new Promise((resolve) => setTimeout(resolve, 180000));

      expect(await coinflipContract.userToCoinflip(deployer.address)).to.equal(
        false
      );
    });
  });
}
