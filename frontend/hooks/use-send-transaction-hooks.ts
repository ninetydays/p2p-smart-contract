import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

export const useSendTransactionHooks = (params: any) => {
  const prepareSendTransaction = usePrepareSendTransaction(params);
  const sendTransaction = useSendTransaction(prepareSendTransaction.config);
  const waitForTransaction = useWaitForTransaction({
    hash: sendTransaction?.data?.hash,
  });

  return {
    prepareSendTransaction,
    sendTransaction,
    waitForTransaction,
  };
};
