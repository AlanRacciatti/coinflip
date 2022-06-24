import { useState } from "react";
import { Typography, Button } from "web3uikit";
import Coinflip from "./Coin";
import styles from "../styles/CoinflipGame.module.css";

export default function CoinflipGame() {
  const [isFlippingCoin, setIsFlippingCoin] = useState(false);

  const flipCoin = () => {
    setIsFlippingCoin(!isFlippingCoin);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h1">
        Flip the coin and duplicate your ETH in seconds!
      </Typography>
      <Coinflip isFlippingCoin={isFlippingCoin} />
      <Button
        id="test-button-primary"
        onClick={() => flipCoin()}
        text="Flip coin"
        theme="colored"
        color="yellow"
        type="button"
      />
    </div>
  );
}
