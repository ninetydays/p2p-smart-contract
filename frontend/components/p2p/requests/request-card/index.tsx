import { Card, Elevation, Divider, ButtonGroup } from "@blueprintjs/core";
import { useAccount } from "wagmi";
import { RequestType } from "@/types";
import { CancelButton, PayButton } from "./buttons";

import styles from "./request-card.module.css";
type Props = {
  request: RequestType;
};

const RequestCard: React.FC<Props> = ({ request }) => {
  const { address } = useAccount();
  const isMine = Boolean(address === request.applicant);

  return (
    <Card
      key={request.applicant}
      elevation={Elevation.TWO}
      className={styles.itemContainer}
    >
      <ButtonGroup vertical={false}>
        <span>Address:</span>
        <Divider />
        <span className={styles.requestItem}>{request.applicant}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Amount:</span>
        <Divider />
        <span className={styles.requestItem}>{String(request.amount)}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Duration:</span>
        <Divider />
        <span className={styles.requestItem}>{String(request.duration)}</span>
      </ButtonGroup>
      <ButtonGroup vertical={false}>
        <span>Payoff:</span>
        <Divider />
        <span className={styles.requestItem}>{String(request.payoff)}</span>
      </ButtonGroup>
      <Divider />
      <ButtonGroup vertical={false}>
        {isMine ? <CancelButton /> : <PayButton request={request} />}
      </ButtonGroup>
    </Card>
  );
};

export default RequestCard;
