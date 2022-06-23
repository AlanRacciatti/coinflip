import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy/dist/src/type-extensions";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";

import { network } from "hardhat";
import { ethers } from "ethers";

const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = 1e9;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [BASE_FEE, GAS_PRICE_LINK];

  if (developmentChains.includes(network.name)) {
    log("Local network detected, deploying mocks");
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args,
    });
    log("Mocks deployed!");
    log("----------------------------------------------");
  }
};

module.exports = func;
module.exports.tags = ["all", "main", "mocks"];
