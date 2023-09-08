# p2p-smart-contract

This repo implements basic P2P lending running on the etherium networks.
This is not suitable for production but just illustrative purposes only.

## Prerequisite

-   nodejs
-   block chain wallet

## Backend

Smart contract implementation which is in `/backend` directory. It includes local ethereum network which running on `http://127.0.0.1:8545` and chainId is `31337`.
Development framework is [hardhat](https://hardhat.org/)

#### Installation

```console
$ yarn install
```

#### Run test

```console
$ yarn test
```

#### Run node

```console
$ yarn start
```

followed by

```console
$ yarn deploy
```

## Frontend

web UI for the smart contract, it's in `/frontend` directory. and basically this is [nextjs](https://nextjs.org/) app with some ethereum library such as [wagmi](https://wagmi.sh/) or [connectkit](https://docs.family.co/connectkit)

#### Installation

```console
$ yarn install
```

#### Run locally

```console
$ yarn dev
```

make sure to update `next.config.js` that smart contract's address is valid. you can find the address when you deploy the contract
