import { ethers } from "hardhat";

async function main() {
  const Coinflip = await ethers.getContractFactory("Coinflip");
  const coinflip = await Coinflip.deploy(
    5555,
    "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"
  );

  await coinflip.deployed();

  console.log("Coinflip deployed to:", coinflip.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
