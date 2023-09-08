import { useCallback } from "react";
import { Button } from "@blueprintjs/core";
import { RequestType } from "@/types";
import { cancelABI, payABI } from "@/abis";
import { Address } from "wagmi";
import { useContractWriteHooks, useSendTransactionHooks } from "@/hooks";
import { parseEther } from "ethers";

type Props = {
  request: RequestType;
};

export const CancelButton = () => {
  const {
    contractWrite: { write, isLoading },
  } = useContractWriteHooks({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [cancelABI],
    functionName: "cancel",
  });

  return (
    <Button
      intent={"danger"}
      text={"Cancel"}
      onClick={() => write?.()}
      loading={isLoading}
    />
  );
};

export const PayButton = ({ request }: Props) => {
  const {
    sendTransaction: { sendTransactionAsync },
    waitForTransaction: { isSuccess, error, isError },
  } = useSendTransactionHooks({
    to: process.env.CONTRACT_ADDR as Address,
    value: parseEther(String(request.amount)),
  });

  const {
    contractWrite: { write, isLoading },
  } = useContractWriteHooks({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [payABI],
    functionName: "pay",
    args: [request.applicant],
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

  const onPay = () => {
    if (sendTransactionAsync) {
      sendTransactionAsync()
        .then(checkStatus)
        .then(() => {
          console.log("write:", write);
          write?.();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Button
      intent={"primary"}
      text={"Pay"}
      onClick={onPay}
      loading={isLoading}
    />
  );
};
