import { ReactNode } from "react";
import { EditorNav } from "./editor-nav";
import { CollabProvider } from "@/context/CollabContext";
import { ShareButton } from "@/components/share-button";

const EditorLayout: React.FC<{
  children: ReactNode;
  params: { room: string };
}> = ({ children, params: { room } }) => {
  return (
    <div className="relative h-screen scroll-m-3 overflow-scroll">
      <CollabProvider room={room}>
        <EditorNav shareButton={<ShareButton room={room} />} />
        {children}
      </CollabProvider>
    </div>
  );
};
export default EditorLayout;
