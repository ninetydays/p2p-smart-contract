import { useState, FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  InputGroup,
  FormGroup,
} from "@blueprintjs/core";
import { requestABI } from "@/abis";
import { Address } from "wagmi";
import { useDebounce } from "usehooks-ts";
import { useContractWriteHooks } from "@/hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type RequestParams = {
  amount: bigint;
  duration: bigint;
  payoff: bigint;
};

const RequestForm = ({ isOpen, onClose }: Props) => {
  const [params, setParams] = useState<RequestParams>({
    amount: BigInt(0),
    duration: BigInt(0),
    payoff: BigInt(0),
  });

  const setValue = (name: string) => (value: string) =>
    setParams({ ...params, [name]: BigInt(value) });

  const debouncedParams = useDebounce(params, 500);
  const {
    prepareContractWrite: { error: prepareError },
    contractWrite: { write, error: writeError, isLoading },
  } = useContractWriteHooks({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [requestABI],
    functionName: "request",
    args: [
      debouncedParams.amount,
      debouncedParams.duration,
      debouncedParams.payoff,
    ],
  });

  const error = prepareError || writeError;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    write?.();
  };

  return (
    <Dialog title="new request" icon="add" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <DialogBody>
          <FormGroup label="Amount" labelFor="amount" labelInfo="(required)">
            <InputGroup
              id="amount"
              placeholder="Enter your amount..."
              type="text"
              onValueChange={setValue("amount")}
            />
          </FormGroup>
          <FormGroup
            label="Duration"
            labelFor="duration"
            labelInfo="(required)"
          >
            <InputGroup
              id="duration"
              placeholder="Enter loan duration in days..."
              type="text"
              onValueChange={setValue("duration")}
            />
          </FormGroup>
          <FormGroup label="Payoff" labelFor="payoff">
            <InputGroup
              id="payoff"
              placeholder="How much will you repay more"
              type="text"
              onValueChange={setValue("payoff")}
            />
          </FormGroup>
          <span>{error?.message}</span>
        </DialogBody>
        <DialogFooter
          actions={[
            <Button
              key={"close"}
              intent="danger"
              text="Close"
              onClick={onClose}
            />,
            <Button
              key={"submit"}
              intent="primary"
              text={isLoading ? "Requesting..." : "Request"}
              disabled={!write || isLoading}
              type="submit"
            />,
          ]}
        />
      </form>
    </Dialog>
  );
};

export default RequestForm;
