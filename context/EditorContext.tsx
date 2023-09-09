"use client"

import React, { Dispatch, SetStateAction, useEffect } from "react"

interface EditorContextProps {
  vaultSlug: string
}

const EditorContext = React.createContext<EditorContextProps>({
  vaultSlug: null,
})

export const EditorContextProvider = ({ children, slug }) => {
  const vaultSlug = slug 

  const value = { vaultSlug }

  // Set values for your context properties here
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  )
}

export const useEditorContext = () => React.useContext(EditorContext)

export default EditorContext
