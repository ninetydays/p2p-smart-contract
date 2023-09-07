import { useCallback } from "react";
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

  const checkStatus = useCallback(() => {
    const process = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (isSuccess) {
          resolve();
        } else if (isError) {
          reject(error?.message);
        } else {
          return new Promise((res) =>
            setTimeout(() => {
              res(1);
            }, 500)
          ).then(() => process());
        }
      });
    };
    process();
  }, [isSuccess, isError, error]);

  const onRepay = () => {
    if (sendTransactionAsync) {
      sendTransactionAsync()
        .then(checkStatus)
        .then(() => write?.())
        .catch((err) => console.error(err));
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
