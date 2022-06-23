import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  BigNumber,
  Contract,
  ContractReceipt,
  ContractTransaction,
  Event,
} from "ethers";
import { ethers } from "hardhat";
import { Coinflip } from "../../typechain";

export const getParsedBalance = async (
  contract: Contract | SignerWithAddress
): Promise<string> => {
  const balance: BigNumber = await contract.provider!.getBalance(
    contract.address
  );
  const parsedBalance: string = ethers.utils.formatEther(balance);

  return parsedBalance;
};

export const fundContract = async (
  fundEth: string,
  coinflipContract: Coinflip,
  signer: SignerWithAddress
): Promise<string> => {
  await signer.sendTransaction({
    to: coinflipContract.address,
    value: ethers.utils.parseEther(fundEth),
  });

  const balance: BigNumber = await coinflipContract.provider.getBalance(
    coinflipContract.address
  );

  const parsedBalance: string = ethers.utils.formatEther(balance);

  return parsedBalance;
};

export const getContractEvent = async (
  tx: ContractTransaction,
  event: string
): Promise<Event> => {
  const txReceipt: ContractReceipt = await tx.wait();
  const eventFound: Event = txReceipt.events!.find((e) => e.event === event)!;

  return eventFound;
};

export const getVrfRequestId = async (
  tx: ContractTransaction
): Promise<number> => {
  const event: Event = await getContractEvent(tx, "RandomnessRequested");
  const requestId: any = event.args![0];

  return requestId.toNumber();
};

export const checkHasWon = async (
  coinflipContract: Coinflip,
  requestId: number
): Promise<boolean> => {
  const hasWonIndex: number = 2;
  return !!(await coinflipContract.requestIdToBet(requestId))[hasWonIndex];
};
