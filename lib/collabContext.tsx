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

export interface collabContext {
  provider: yPartykitProvider;
  initProvider: (room: string, token: string) => void;
  connectionStatus: "disconnected" | "connecting" | "connected";
}

const yDoc = new Doc();

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

export const CollabProvider = ({ children }: { children: ReactNode }) => {
  const providerRef = useRef(
    new yPartykitProvider(`nijika.iojcde.partykit.dev`, "offline-room", yDoc, {
      connect: false,
    })
  );

  const provider = providerRef.current;

  const computedConnectionStatus = provider.wsconnected
    ? "connected"
    : provider.wsconnecting
    ? "connecting"
    : "disconnected";

  const [connectionState, setConnectionState] = useState<ConnectionStatus>(
    computedConnectionStatus
  );

  useEffect(() => {
    provider.on("status", (event: { status: ConnectionStatus }) => {
      setConnectionState(event.status);
    });
  }, [provider]);

  if (connectionState !== computedConnectionStatus) {
    setConnectionState(computedConnectionStatus);
  }

  const initProvider = (room: string, token: string) => {
    const p = new yPartykitProvider(`nijika.iojcde.partykit.dev`, room, yDoc, {
      connect: false,
    });
    p.url += `&token=${encodeURIComponent(token)}`;

    providerRef.current = p;
  };

  const value = {
    provider: providerRef.current,
    initProvider,
    connectionStatus: connectionState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type AwarenessStates = ReturnType<Awareness["getStates"]>;

export function useUsers() {
  const { provider } = useCollabContext();
  const awareness = provider.awareness;

  const ref = useRef<AwarenessStates>();

  if (!ref.current) {
    ref.current = new Map(awareness.getStates());
  }

  const subscribe = useCallback(
    (listener: () => void) => {
      const onChange = () => {
        ref.current = awareness.getStates();
        listener();
      };

      awareness.on("change", onChange);
      return () => awareness.off("change", onChange);
    },
    [awareness]
  );

  const getSnapshot = useCallback(() => {
    if (!ref.current) {
      return new Map();
    }
    return ref.current;
  }, []);

  return useSyncExternalStore<AwarenessStates>(
    subscribe,
    getSnapshot,
    getSnapshot
  );
}

export const useCollabContext = () => {
  return useContext(Context);
};
