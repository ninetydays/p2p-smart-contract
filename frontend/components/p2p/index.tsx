import styles from "./p2p.module.css";

import UserCard from "./user-card";
import Requests from "./requests";
import Loans from "./loans";

const P2P = () => {
  return (
    <div className={styles.container}>
      <UserCard />
      <Requests />
      <Loans />
    </div>
  );
};

export default P2P;
