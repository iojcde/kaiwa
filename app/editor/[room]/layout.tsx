import { ReactNode } from "react";
import { EditorNav } from "./editor-nav";
import { CollabProvider } from "@/context/CollabContext";
const EditorLayout: React.FC<{
  children: ReactNode;
  params: { room: string };
}> = ({ children, params: { room } }) => {
  return (
    <div className="relative h-screen scroll-m-3">
      <CollabProvider room={room}>
        <EditorNav />
        {children}
      </CollabProvider>
    </div>
  );
};
export default EditorLayout;
