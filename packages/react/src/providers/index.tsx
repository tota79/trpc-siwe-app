//Imports
import WagmiProvider from "./wagmi";
import QueryProvider from "./query";
import TRPCProvider from "./trpc";
//Root Provider
const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <WagmiProvider>
        <TRPCProvider>
          <QueryProvider>{children}</QueryProvider>
        </TRPCProvider>
      </WagmiProvider>
    </div>
  );
};

export default RootProvider;
