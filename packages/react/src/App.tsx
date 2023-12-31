import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useDisconnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import trpc from "./utils/trpc";
import { SiweMessage } from "siwe";
// Components

const App = () => {
  //state/props
  const [state, setState] = useState<{
    isLoading?: boolean;
    isSignedIn?: boolean;
    nonce?: {
      expirationTime?: string;
      issuedAt?: string;
      nonce?: string;
    };
    address?: string;
    error?: Error | string;
  }>({});

  //hooks
  const { address, isConnected } = useAccount();
  const { connect, error: errorConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect, error: errorDisconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  //requests

  const authNonce = trpc.authNonce.useQuery(undefined, {
    enabled: false,
  });
  const authMe = trpc.authMe.useQuery(undefined, {
    enabled: false,
  });
  const authLogout = trpc.authLogout.useQuery(undefined, {
    enabled: false,
  });

  const authVerify = trpc.authVerify.useMutation();

  // Functions
  /**
   * Performs a SIWE Signature prompt request
   * @returns {void}
   */

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      const nonce = await authNonce.refetch();
      if (!address || !chainId) return;
      setState((x) => ({ ...x, nonce: nonce?.data, isLoading: true }));

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to SIWE",
        uri: window.location.origin,
        version: "1",
        chainId,
        expirationTime: nonce?.data?.expirationTime,
        issuedAt: nonce?.data?.issuedAt,
        nonce: nonce?.data?.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      authVerify.mutate({ message, signature });
    } catch (error) {
      setState((x) => ({
        ...x,
        isLoading: false,
        nonce: undefined,
        error: error as Error,
      }));
    }
  };

  /**
   * Performs a SIWE Signature prompt request
   * @returns {void}
   */
  const getMe = async () => {
    const address = await authMe.refetch();
    setState((x) => ({ ...x, address: address.data?.address }));
  };

  /**
   * Destroys session cookie which logs the user out
   * @returns {void}
   */

  const signOut = async () => {
    await authLogout.refetch();
    setState((x) => ({ ...x, address: undefined, isSignedIn: false }));
  };

  // on mount

  useEffect(() => {
    if (!isConnected || !authVerify.data) return;

    if (authVerify?.data?.ok) {
      setState((x) => ({ ...x, isSignedIn: true, isLoading: false }));
    } else {
      setState((x) => ({
        ...x,
        isSignedIn: false,
        isLoading: false,
        error: authVerify.data?.error,
      }));
    }
    setState((x) => ({ ...x, nonce: authNonce.data }));
  }, [isConnected, authVerify?.data]);

  //render

  return (
    <main>
      <div className="p-6">
        <h1 className="text-2xl text-white font-medium mb-4 border-b border-zinc-800 pb-4">
          tRPC SIWE Monorepo
        </h1>
        {!isConnected ? (
          <button
            onClick={() => connect()}
            className="h-10 mb-4 block rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="h-10 mb-4 block rounded-full px-6 text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-200"
          >
            Disconnect
          </button>
        )}
        {errorConnect || errorDisconnect ? (
          <code className="bg-zinc-800 text-white p-4 mb-10 block">
            {JSON.stringify(
              {
                error:
                  errorConnect?.message ||
                  errorDisconnect?.message ||
                  "Unknown wallet error.",
              },
              null,
              " "
            )}
          </code>
        ) : null}

        {isConnected ? (
          <div className="border-t border-zinc-800 pt-4">
            <label className="text-sm text-zinc-400 block mb-2">
              Wallet Connected
            </label>
            <code className="bg-zinc-800 text-white p-4 mb-10 block">
              {address};
            </code>

            <button
              onClick={signIn}
              className="h-10 mb-4 rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
            >
              Sign-In With Ethereum
            </button>
            <label className="text-sm text-zinc-400 block mb-2">
              Message & Signature
            </label>
            <code className="bg-zinc-800 text-white p-4 mb-10 block">
              <pre>{JSON.stringify(state, null, " ")}</pre>
            </code>

            <button
              onClick={getMe}
              className="h-10 mb-4 rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
            >
              Retrive User Session Info
            </button>
            <label className="text-sm text-zinc-400 block mb-2">
              Session Information (/trpc/authMe)
            </label>
            <code className="bg-zinc-800 text-white p-4 mb-10 block">
              <pre>{JSON.stringify(state?.address ?? null, null, " ")}</pre>
            </code>

            <button
              onClick={signOut}
              className="h-10 mb-4 rounded-full px-6 text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-200"
            >
              Log Out
            </button>
            <label className="text-sm text-zinc-400 block mb-2">
              Log Out Result
            </label>
            <code className="bg-zinc-800 text-white p-4 block">
              <pre>
                {JSON.stringify({ isSignedIn: state.isSignedIn }, null, " ")}
              </pre>
            </code>
          </div>
        ) : null}
      </div>
    </main>
  );
};
export default App;
