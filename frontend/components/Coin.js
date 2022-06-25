import styles from "../styles/Coin.module.css";
import Image from "next/image";

import bitcoinCoin from "../public/bitcoin-coin.png";
import ethereumCoin from "../public/ethereum-coin.png";

export default function Coin({ isFlippingCoin, coinToShow }) {
  return (
    <div
      className={
        isFlippingCoin
          ? `${styles.container} ${styles.animationTrigger}`
          : styles.container
      }
    >
      <div className={styles.heads}>
        <Image
          src={coinToShow === "eth" ? ethereumCoin : bitcoinCoin}
          width={300}
          height={300}
          alt="Ethereum"
        />
      </div>
      <div className={styles.tails}>
        <Image
          src={coinToShow === "eth" ? bitcoinCoin : ethereumCoin}
          width={300}
          height={300}
          alt="Bitcoin"
        />
      </div>
    </div>
  );
}
