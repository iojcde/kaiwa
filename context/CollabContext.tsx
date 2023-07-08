"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import yPartykitProvider from "y-partykit/provider";
import { Doc } from "yjs";
import type { Awareness } from "y-protocols/awareness";
import { useSession } from "next-auth/react";

export interface collabContext {
  provider: yPartykitProvider;
  initProvider: (room: string, token: string) => void;
  connectionStatus: "disconnected" | "connecting" | "connected";
}

export let yDoc = new Doc();

const Context = createContext<collabContext>({
  provider: new yPartykitProvider(
    `nijika.iojcde.partykit.dev`,
    "offline-room",
    yDoc,
    {
      connect: false,
    }
  ),
  initProvider: () => {},
  connectionStatus: "disconnected",
});

// export const useCollabProvider = () => {
//   const [partykitProvider] = useAtom(collabProviderAtom);

//   return partykitProvider;
// };

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export const CollabProvider = ({
  children,
  room,
}: {
  children: ReactNode;
  room: string;
}) => {
  const { data: session, status } = useSession();

  const [provider, setProvider] = useState(
    new yPartykitProvider(`nijika.iojcde.partykit.dev`, "offline-room", yDoc, {
      connect: false,
    })
  );

  const computedConnectionStatus = provider.wsconnected
    ? "connected"
    : provider.wsconnecting
    ? "connecting"
    : "disconnected";

  const [connectionState, setConnectionState] = useState<ConnectionStatus>(
    computedConnectionStatus
  );

  useEffect(() => {
    if (
      status == "authenticated" &&
      session?.wsToken &&
      !provider.wsconnected &&
      !provider.wsconnecting &&
      provider.roomname == room
    ) {
      console.log("connecting wow");
      const url = new URL(provider.url);
      url.searchParams.set("token", session?.wsToken);
      provider.url = url.toString();
      provider.connect();

      provider.awareness.setLocalStateField("user", {
        color: "#FFC0CB",
        name: session.user.name,
      });
    }
  }, [status, provider]);

  useEffect(() => {
    provider.on("status", (event: { status: ConnectionStatus }) => {
      setConnectionState(event.status);
    });
  }, [provider]);

  if (connectionState !== computedConnectionStatus) {
    setConnectionState(computedConnectionStatus);
  }

  const initProvider = (room: string, token: string) => {
    console.log("initprovider", { room, token });

    yDoc = new Doc();
    const p = new yPartykitProvider(`nijika.iojcde.partykit.dev`, room, yDoc, {
      connect: false,
    });
    p.url += `&token=${encodeURIComponent(token)}`;
    Object.assign(window, { yProvider: p });
    setProvider(p);
  };

  const value = {
    provider,
    initProvider,
    connectionStatus: connectionState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCollabContext = () => {
  return useContext(Context);
};
