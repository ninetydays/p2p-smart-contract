import { useEffect } from "react";
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

  const onPay = () => {
    if (sendTransactionAsync) {
      sendTransactionAsync().catch((err) => console.error(err));
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
