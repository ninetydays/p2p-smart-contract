import { Button, Card, Elevation } from "@blueprintjs/core";
import { useState } from "react";
import { useAccount, Address } from "wagmi";
import { fetchBalance } from "@wagmi/core";

import styles from "./user-card.module.css";

type Balance = {
  decimals?: number;
  formatted?: string;
  symbol?: string;
  value?: bigint;
};

const UserCard = () => {
  const [balance, setBalance] = useState<Balance>({});

  const getBalance = (address: Address | undefined) =>
    address && fetchBalance({ address }).then((res) => setBalance(res));

  const { address, isConnected, status } = useAccount({
    onConnect: ({ address }) => getBalance(address),
  });
  return (
    <Card interactive={true} elevation={Elevation.TWO} className={styles.card}>
      {isConnected ? (
        <>
          <h5>{address}</h5>
          <p>{`${balance.formatted} ${balance.symbol}`}</p>
          <Button onClick={() => getBalance(address)}>Refresh</Button>
        </>
      ) : (
        <h5>{status}</h5>
      )}
    </Card>
  );
};

export default UserCard;
