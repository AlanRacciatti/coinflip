import { Coinflip } from "../typechain";
import fs from "fs";
import { network } from "hardhat";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const FRONT_END_ADDRESSES_FILE = "../frontend/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../frontend/constants/abi.json";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end");
    await updateAbi(hre);
    await updateContractAddresses(hre);
  }
};

async function updateAbi(hre: HardhatRuntimeEnvironment) {
  const coinflip: Coinflip = await hre.ethers.getContract("Coinflip");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    coinflip.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses(hre: HardhatRuntimeEnvironment) {
  const coinflip: Coinflip = await hre.ethers.getContract("Coinflip");
  const chainId = network.config.chainId!.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8") || "{}"
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(coinflip.address)) {
      currentAddresses[chainId].push(coinflip.address);
    }
  } else {
    currentAddresses[chainId] = [coinflip.address];
  }

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "main", "frontend"];
