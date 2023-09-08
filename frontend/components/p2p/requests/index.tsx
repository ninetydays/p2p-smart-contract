import { useState } from "react";
import { Button } from "@blueprintjs/core";
import { Address, useContractRead } from "wagmi";
import { getRequestsABI } from "@/abis";
import RequestForm from "./request-form";
import RequestCard from "./request-card";

import { RequestType } from "@/types";

import styles from "./requests.module.css";

const Requests = () => {
  const { isError, error, data, refetch, isLoading } = useContractRead({
    address: process.env.CONTRACT_ADDR as Address,
    abi: [getRequestsABI],
    functionName: "getRequests",
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1>Requests</h1>
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
        <>
          {(data as Array<RequestType> || []).map((request) => (
            <RequestCard key={String(request.applicant)} request={request} />
          ))}
          <div className={styles.addContainer}>
            <Button
              icon="add"
              text={"new request"}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </>
      )}
      <RequestForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Requests;
