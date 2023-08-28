import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";

//import { createPublicClient, http } from "viem";

//Config
///////////////////////////////////////////
const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});
// Provider
///////////////////////////////////////////
const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

///////////////////////////////////////////
export default WagmiProvider;
