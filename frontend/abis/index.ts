import fixture from "../../backend/artifacts/contracts/PeerToPeer.sol/PeerToPeer.json";

const { abi } = fixture;

const getABI = (name: string, type: string) =>
  abi.find((a) => a.name === name && a.type == type);

export const getRequestsABI = getABI("getRequests", "function");
export const getLoansABI = getABI("getLoans", "function");
export const requestABI = getABI("request", "function");
export const cancelABI = getABI("cancel", "function");
export const payABI = getABI("pay", "function");
export const repayABI = getABI("repay", "function");
