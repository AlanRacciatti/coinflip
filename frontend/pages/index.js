import Head from "next/head";
import Header from "../components/Header";
import Coinflip from "../components/CoinflipGame";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Coinflip 💰</title>
        <meta name="description" content="Bet, flip, win" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Coinflip />
      <Footer />
    </div>
  );
}
