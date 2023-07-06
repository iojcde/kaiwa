import { ReactNode } from "react";

import { save } from "./save";
const EditorLayout: React.FC<{
  children: ReactNode;
  params: { id: string };
}> = ({ children, params: { id } }) => {
  return <div className="relative h-screen scroll-m-3">{children}</div>;
};
export default EditorLayout;
