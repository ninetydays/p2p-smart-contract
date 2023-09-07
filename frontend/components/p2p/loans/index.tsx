import { Button } from "@blueprintjs/core";
import { Address, useContractRead } from "wagmi";
import { getLoansABI } from "@/abis";
import LoanCard from "./loan-card";

import { LoanType } from "@/types";

import styles from "./loans.module.css";

const Loans = () => {
  const {
    isError,
    error,
    data = [],
    refetch,
    isLoading,
  } = useContractRead({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [getLoansABI],
    functionName: "getLoans",
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1>Loans</h1>
        <Button
          icon="refresh"
          text={isLoading ? "loading" : "refresh"}
          disabled={isLoading}
          onClick={() => refetch()}
        />
      </div>
      {isError ? (
        <span>{error && error.message}</span>
      ) : (
        (data as Array<LoanType>).map((loan) => (
          <LoanCard key={String(loan.borrower)} loan={loan} />
        ))
      )}
    </div>
  );
};

export default Loans;
