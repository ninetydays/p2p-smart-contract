import { useEffect } from "react";
import { Button } from "@blueprintjs/core";
import { LoanType } from "@/types";
import { repayABI } from "@/abis";
import { Address } from "wagmi";
import { useContractWriteHooks, useSendTransactionHooks } from "@/hooks";
import { parseEther } from "ethers";

type Props = {
  loan: LoanType;
};

export const RepayButton = ({ loan }: Props) => {
  const {
    sendTransaction: { sendTransactionAsync },
    waitForTransaction: { isSuccess, error, isError },
  } = useSendTransactionHooks({
    to: process.env.CONTRACT_ADDR as Address,
    value: parseEther(String(loan.amount + loan.payoff)),
  });

  const {
    contractWrite: { write, isLoading },
  } = useContractWriteHooks({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [repayABI],
    functionName: "repay",
    args: [],
  });

  useEffect(() => {
    if (isSuccess && write) {
      write();
    }
  }, [write, isSuccess]);

  useEffect(() => {
    if (isError && error) {
      alert(error.message);
    }
  }, [isError, error]);

  const onRepay = () => {
    if (sendTransactionAsync) {
      sendTransactionAsync().catch((err) => console.error(err));
    }
  };

  return (
    <Button
      intent={"primary"}
      text={"Repay"}
      onClick={onRepay}
      loading={isLoading}
    />
  );
};
