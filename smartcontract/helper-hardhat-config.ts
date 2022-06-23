const networkConfig = {
  4: {
    subscriptionId: process.env.SUBSCRIPTION_ID,
    name: "rinkeby",
    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
  },
  31337: {
    subscriptionId: 0,
    name: "hardhat",
    vrfCoordinatorV2: "0x0000000000000000000000000000000000000000",
  },
};

const developmentChains = ["hardhat", "localhost"];

export { networkConfig, developmentChains };
