<div id="top"></div>

<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://i.gifer.com/origin/71/719ea2f44c791fc07e0e811940a0232b_w200.gif" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Coinflip</h3>

  <p align="center">
    Flip the coin and win ETH
    <br />
    <a href="https://github.com/AlanRacciatti/coinflip">View Demo</a>
    ·
    <a href="https://github.com/AlanRacciatti/coinflip/issues">Report Bug</a>
    ·
    <a href="https://github.com/AlanRacciatti/coinflip/issues">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#smart-contract">Smart Contract</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This blockchain-based project allows users to bet ETH and randomly duplicate or lose their bet

### Built With

##### Frontend

* [React.js](https://reactjs.org/)
* [Next.js](https://nextjs.org/)
* [Moralis](https://moralis.io/)
* [Web3UIKit](https://github.com/web3ui/web3uikit)

#### Smart Contract

* [Solidity](https://docs.soliditylang.org/en/v0.8.15/)
* [Hardhat](https://hardhat.org)
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [Chainlink VRF](https://vrf.chain.link/)

<p align="right">(<a href="#top">Back to top</a>)</p>

## Getting Started

### Smart contract

#### Prerequisites

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [npm](https://www.npmjs.com/)
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
- [Hardhat](https://hardhat.org/)
  - You'll know you've installed yarn right if you can run:
    - `npx hardhat --version` and get an output like: `x.x.x`

#### Quickstart

```bash
git clone github.com/AlanRacciatti/coinflip
cd coinflip
npm i
```
   
#### Usage   
Deploy:

```bash
npx hardhat deploy
```

#### Test:
Unit tests

```bash
npx hardhat test
```

Integration tests

```
npx hardhat test --network <deployed-contract-network>
```

#### Deploying to mainnet or testnet
1. Setup environment variabltes

You'll want to set your `RINKEBY_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `RINKEBY_RPC_URL`: This is url of the rinkeby testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH & LINK. You should see the ETH and LINK show up in your metamask. [You can read more on setting up your wallet with LINK.](https://docs.chain.link/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet)

3. Setup a Chainlink VRF Subscription ID

Head over to [vrf.chain.link](https://vrf.chain.link/) and setup a new subscription, and get a subscriptionId. You can reuse an old subscription if you already have one. 

[You can follow the instructions](https://docs.chain.link/docs/get-a-random-number/) if you get lost. You should leave this step with:

1. A subscription ID
2. Your subscription should be funded with LINK

3. Deploy

In your `.env` add your `subscriptionId`
Note: The subscription id is expected to be of a Rinkeby contract. To use another network you can setup it in `helper-hardhat-config.ts`

Then run:
```
yarn hardhat deploy --network rinkeby
```

And copy / remember the contract address. 

4. Add your contract address as a Chainlink VRF Consumer

Go back to [vrf.chain.link](https://vrf.chain.link) and under your subscription add `Add consumer` and add your contract address. You should also fund the contract with a minimum of 1 LINK. 


<p align="right">(<a href="#top">Back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">Back to top</a>)</p>

<!-- LICENSE -->
## License

[MIT](https://choosealicense.com/licenses/mit/)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Testing Chainlink VRF powered Smart Contract](https://dev.to/abhikbanerjee99/testing-your-chainlink-vrf-powered-smart-contract-m3i)

<p align="right">(<a href="#top">Back to top</a>)</p>
