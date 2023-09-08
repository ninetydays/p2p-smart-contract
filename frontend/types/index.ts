import { Address } from "wagmi";

export type RequestType = {
  amount: bigint;
  duration: bigint;
  payoff: bigint;
  applicant: Address;
};

export type LoanType = {
  amount: bigint;
  duration: bigint;
  payoff: bigint;
  lender: Address;
  borrower: Address;
};
