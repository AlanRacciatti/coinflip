import { Address } from "hardhat-deploy/dist/types";
import { VRFCoordinatorV2Mock } from "../typechain";
import { DeployFunction, Deployment } from "hardhat-deploy/types";

import { network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ContractReceipt, ContractTransaction, ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;
  let vrfCoordinatorV2Address: Address | undefined, subscriptionId: any;

  const keyHash =
    "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock =
      await hre.ethers.getContract("VRFCoordinatorV2Mock");

    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    const txResponse: ContractTransaction =
      await vrfCoordinatorV2Mock.createSubscription();

    const txReceipt: ContractReceipt = await txResponse.wait(1);

    const subscriptionIdEvent = txReceipt.events?.find(
      (x) => x.event === "SubscriptionCreated"
    )!;

    subscriptionId = subscriptionIdEvent.args ? subscriptionIdEvent.args[0] : 0;
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId!,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address =
      networkConfig[chainId as keyof typeof networkConfig].vrfCoordinatorV2;
    subscriptionId =
      networkConfig[chainId as keyof typeof networkConfig].subscriptionId;
  }

  const args = [subscriptionId, vrfCoordinatorV2Address, keyHash];

  await deploy("Coinflip", {
    from: deployer,
    args,
    log: true,
  });

  log("VRF FUNDING");
  log("------");
  log(
    `Make sure to add your contract as consumer at https://vrf.chain.link/${network.name}/${process.env.SUBSCRIPTION_ID} and fund it with LINK`
  );
  log("-----------------------------------------------------------------");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    const deployedContract: Deployment = await deployments.get("Coinflip");
    if (process.env.ETHERSCAN_API_KEY) {
      log("--------------------------------------");
      log("CONTRACT VERIFICATION");
      log("------");
      log(
        `Verify the contract: npx hardhat verify --network ${network.name} ${deployedContract.address} ${args[0]} "${args[1]}" "${args[2]}"`
      );
    }

    log("--------------------------------------");
  } else {
    log(
      "Get an etherscan API KEY to verify your contract at https://etherscan.io/"
    );
  }
};

module.exports = func;
module.exports.tags = ["all", "main"];
