import { atom, useAtom } from "jotai";

const titleAtom = atom("");
const contentAtom = atom("");

const isPendingAtom = atom(false);
const savedAtom = atom(false);

export const useEditorState = () => {
  const [title, setTitle] = useAtom(titleAtom);
  const [content, setContent] = useAtom(contentAtom);

  const [isPending, setIsPending] = useAtom(isPendingAtom);
  const [saved, setSaved] = useAtom(savedAtom);

  return {
    title,
    setTitle,
    content,
    setContent,
    isPending,
    setIsPending,
    saved,
    setSaved,
  };
}; 
