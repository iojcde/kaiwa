import { atom, useAtom } from "jotai";
import yPartykitProvider from "y-partykit/provider";
import { Doc } from "yjs";

const collabProviderAtom = atom(null);

export const useCollabProvider = () => {
  const [partykitProvider] = useAtom(collabProviderAtom);

  return partykitProvider;
};

export const createCollabProvider = (room: string, token) => {
  const yDoc = new Doc();
  const partykitProvider = new yPartykitProvider(
    `nijika.iojcde.partykit.dev`,
    room,
    yDoc,
    {
      connect: false,
    }
  );
  partykitProvider.url += `&token=${encodeURIComponent(token)}`;

  return { provider: partykitProvider, doc: yDoc };
};
