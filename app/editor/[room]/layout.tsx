import { ReactNode } from "react";
import { EditorNav } from "./editor-nav";

import { save } from "./save";
const EditorLayout: React.FC<{
  children: ReactNode;
  params: { id: string };
}> = ({ children, params: { id } }) => {
  return (
    <div className="relative scroll-m-3">
      <EditorNav save={save} id={id} />
      {children}
    </div>
  );
};
export default EditorLayout;
