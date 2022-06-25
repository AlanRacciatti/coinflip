import { useEffect, useState } from "react";
import { Typography, Button, useNotification, Input } from "web3uikit";
import Coinflip from "./Coin";
import styles from "../styles/CoinflipGame.module.css";
import { useWeb3Contract, useMoralis, useWeb3Transfer } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { BigNumber, ethers } from "ethers";
import handleNewNotification from "../utils/handleNewNotification";

export default function CoinflipGame() {
  const [isFlippingCoin, setIsFlippingCoin] = useState(false);
  const [bet, setBet] = useState(0);
  const [fundAmount, setFundAmount] = useState(0);

  const [isFundingContractTx, setIsFundingContractTx] = useState(false);

  const dispatch = useNotification();

  const { chainId: chainIdHex, web3, Moralis } = useMoralis();
  const chainId = parseInt(chainIdHex, 16);
  const coinflipAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const {
    runContractFunction: requestCoinflip,
    isFetching: isRequestingCoinflip,
  } = useWeb3Contract({
    abi,
    contractAddress: coinflipAddress,
    functionName: "requestCoinflip",
    params: {},
    msgValue: ethers.utils.parseEther(bet.toString()),
  });

  const getContractBalance = async () => {
    return await web3.getBalance(coinflipAddress);
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    txCompletedNotificaton();
  };

  const txCompletedNotificaton = () => {
    handleNewNotification(dispatch, {
      type: "info",
      message: "Transaction Complete!",
      title: "Tx notification",
      icon: "bell",
    });
  };

  const noContractFundsNotification = () => {
    handleNewNotification(dispatch, {
      type: "error",
      message: "Insufficient contract funds",
      title: "No funds!",
    });
  };

  const {
    fetch: fundContract,
    isFetching: isFundingContract,
    data: fundContractData,
  } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(fundAmount),
    receiver: coinflipAddress,
  });

  useEffect(() => {
    if (fundContractData) {
      let ethFunded = fundAmount;
      fundContractData.wait().then(() => {
        setIsFundingContractTx(false);
        handleNewNotification(dispatch, {
          type: "success",
          title: "Contract funded!",
          message: `The contract has been funded with ${fundAmount} ETH`,
        });
      });
    }
  }, [fundContractData]);

  return (
    <div className={styles.container}>
      <Typography variant="h2">
        Flip the coin and duplicate your ETH in seconds!
      </Typography>
      <Coinflip isFlippingCoin={isFlippingCoin} />
      <div className={styles.buttons}>
        <Input
          placeholder="0.01"
          description="Bet (Max: 0.05)"
          onChange={({ target }) => setBet(+target.value)}
          state={bet > 0.05 ? "error" : undefined}
          errorMessage="Max bet: 0.05"
          width={100}
          prefixIcon="eth"
          type="number"
          disabled={isRequestingCoinflip}
        />
        <Button
          id="test-button-primary"
          onClick={async () => {
            const contractBalance = ethers.utils.formatEther(
              await getContractBalance()
            );

            if (bet > contractBalance) {
              return noContractFundsNotification();
            }

            if (bet > 0) {
              await requestCoinflip({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            } else {
              handleNewNotification(dispatch, {
                type: "error",
                title: "Error",
                message: "Invalid bet",
              });
            }
          }}
          text="Flip coin"
          theme="colored"
          color="yellow"
          type="button"
          isLoading={isRequestingCoinflip}
        />
      </div>
      <div className={styles.buttons}>
        <Input
          placeholder="0.01"
          onChange={({ target }) => setFundAmount(+target.value)}
          width={100}
          prefixIcon="eth"
          type="number"
          disabled={isFundingContract || isFundingContractTx}
          description="Fund amount"
        />
        <Button
          id="test-button-primary"
          onClick={async () => {
            if (fundAmount > 0) {
              await fundContract();
              setIsFundingContractTx(true);
            } else {
              handleNewNotification(dispatch, {
                type: "error",
                title: "Error",
                message: "Invalid fund amount",
              });
            }
          }}
          text="Fund contract"
          theme="primary"
          type="button"
          isLoading={isFundingContract || isFundingContractTx}
        />
      </div>
    </div>
  );
}
