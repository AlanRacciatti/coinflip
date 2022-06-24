import { ConnectButton, Typography } from "web3uikit";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import coinflipImg from "../public/favicon.ico";

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <Typography variant="h3">Coinflip</Typography>
          <Image src={coinflipImg} width={24} height={24} />
        </div>
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
