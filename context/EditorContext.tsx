"use client"

import { TreeNode } from "@/types/tree-node"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface EditorContextProps {
  vaultSlug: string
  vaultId: number
  tree: Record<string, TreeNode>
  setTree: Dispatch<SetStateAction<Record<string, TreeNode>>>
}

const EditorContext = React.createContext<EditorContextProps>({
  vaultSlug: null,
  vaultId: null,
  tree: null,
  setTree: () => {},
})

export const EditorContextProvider = ({
  children,
  vaultId,
  slug,
  initialTree,
}) => {
  const vaultSlug = slug
  const [tree, setTree] = useState(initialTree)

  const value = { vaultSlug, vaultId, tree, setTree }

  // Set values for your context properties here
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  )
}

export const useEditorContext = () => React.useContext(EditorContext)

export default EditorContext
