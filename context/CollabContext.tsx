"use client"

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import yPartykitProvider from "y-partykit/provider"
import { IndexeddbPersistence } from "y-indexeddb"
import { Doc } from "yjs"
import type { Awareness } from "y-protocols/awareness"
import { useSession } from "next-auth/react"
import { getRandomColor } from "@/lib/randomColor"
import { randomUsername } from "@/lib/randomUsername"

export interface collabContext {
  provider: yPartykitProvider
  doc: Doc
  initProvider: (room: string, token: string) => void
  connectionStatus: "disconnected" | "connecting" | "connected"
}

const yDoc = new Doc()

const offlineProvider = new yPartykitProvider(
  `kaiwa.iojcde.partykit.dev`,
  "offline-room",
  yDoc,
  {
    connect: false,
  }
)

const Context = createContext<collabContext>({
  provider: offlineProvider,
  initProvider: () => {},
  connectionStatus: "disconnected",
  doc: yDoc,
})

type ConnectionStatus = "disconnected" | "connecting" | "connected"

export const CollabProvider = ({
  children,
  room,
}: {
  children: ReactNode
  room: string
}) => {
  const { data: session, status } = useSession()
  const [doc, setDoc] = useState(yDoc)
  const [provider, setProvider] = useState(offlineProvider)

  const computedConnectionStatus = provider.wsconnected
    ? "connected"
    : provider.wsconnecting
    ? "connecting"
    : "disconnected"

  const [connectionState, setConnectionState] = useState<ConnectionStatus>(
    computedConnectionStatus
  )

  useEffect(() => {
    provider.on("status", (event: { status: ConnectionStatus }) => {
      setConnectionState(event.status)
    })
  }, [provider])

  if (connectionState !== computedConnectionStatus) {
    setConnectionState(computedConnectionStatus)
  }

  const initProvider = (room: string, token: string) => {


    console.log("initprovider", { room, token })
    const newdoc = new Doc()
    setDoc(newdoc)

    const indexeddbPersistence =
      typeof window !== "undefined"
        ? new IndexeddbPersistence(room, newdoc)
        : undefined

    provider.destroy()
    const p = new yPartykitProvider(`kaiwa.iojcde.partykit.dev`, room, newdoc, {
      connect: false,
    })
    setProvider(p)

    const url = new URL(p.url)
    url.searchParams.set("token", token)
    p.url = url.toString()

    p.connect()

    p.awareness.setLocalStateField("user", {
      color: getRandomColor(),
      name: session?.user.name ?? randomUsername(),
      photo: session?.user.image,
    })

    indexeddbPersistence.on("synced", (persistence: IndexeddbPersistence) => {
      if (persistence.synced) {
        console.log(
          `%c[Collaboration]%c IndexedDB synced.`,
          "color: rgb(120, 120, 120)",
          "color: inherit"
        )
      }
    }) 
  }

  const value = {
    provider,
    initProvider,
    doc,
    connectionStatus: connectionState,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useCollabContext = () => {
  return useContext(Context)
}
