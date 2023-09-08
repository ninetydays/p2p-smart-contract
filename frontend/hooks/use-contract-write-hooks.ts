import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const useContractWriteHooks = (params: any) => {
  const prepareContractWrite = usePrepareContractWrite(params);
  const contractWrite = useContractWrite(prepareContractWrite.config);
  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite?.data?.hash,
  });

  return {
    prepareContractWrite,
    contractWrite,
    waitForTransaction,
  };
};
