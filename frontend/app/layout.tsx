"use client";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { Navbar, Footer } from "@/components/navigation";
import { publicProvider } from "wagmi/providers/public";
import { hardhat } from "wagmi/chains";
import { InjectedConnector } from "@wagmi/core/connectors/injected";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [hardhat], // we could add mainnet later, currently just support localhost only
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Navbar />
              <div style={{ flexGrow: 1 }}>{children}</div>
              <Footer />
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
