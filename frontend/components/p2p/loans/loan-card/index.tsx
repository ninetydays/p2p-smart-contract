import { Card, Elevation, Divider, ButtonGroup } from "@blueprintjs/core";
import { useAccount } from "wagmi";
import { LoanType } from "@/types";
import { RepayButton } from "./buttons";

import styles from "./loan-card.module.css";
type Props = {
  loan: LoanType;
};

const LoanCard: React.FC<Props> = ({ loan }) => {
  const { address } = useAccount();
  const isMine = Boolean(address === loan.borrower);

  return (
    <Card
      key={loan.borrower}
      elevation={Elevation.TWO}
      className={styles.itemContainer}
    >
      <ButtonGroup vertical={false}>
        <span>Address:</span>
        <Divider />
        <span className={styles.requestItem}>{loan.borrower}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Amount:</span>
        <Divider />
        <span className={styles.requestItem}>{String(loan.amount)}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Duration:</span>
        <Divider />
        <span className={styles.requestItem}>{String(loan.duration)}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Payoff:</span>
        <Divider />
        <span className={styles.requestItem}>{String(loan.payoff)}</span>
      </ButtonGroup>
      <Divider />
      {isMine && (
        <ButtonGroup vertical={false}>
          <RepayButton loan={loan} />
        </ButtonGroup>
      )}
    </Card>
  );
};

export default LoanCard;
