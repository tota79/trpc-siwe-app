import { httpBatchLink } from "@trpc/client";
import trpc from "../../utils/trpc";
import { queryClient } from "../query";

// Config
///////////////////////////////////////////
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_TRPC_SERVER_URL}`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

// Provider
///////////////////////////////////////////
const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
};

// export
///////////////////////////////////////////
export default TRPCProvider;
