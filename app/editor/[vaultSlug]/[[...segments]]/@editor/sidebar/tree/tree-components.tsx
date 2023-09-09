"use client"

import React, {
  FC,
  useState,
  useEffect,
  use,
  Suspense,
  useTransition,
  startTransition,
  cache,
  ReactNode,
} from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Label } from "../label"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { ChevronDown } from "lucide-react"
import Tree from "./tree"
import { Loader2 } from "lucide-react"
import { TreeNode } from "@/types/tree-node"
import { EditorContextMenuWrapper } from "@/components/editor/context-menu"

const NavLink: FC<{
  title: string
  label?: string
  url?: string
  type: string
  active: boolean
  level: number
  collapsed: boolean
  toggleCollapsed: () => void
}> = ({
  title,
  label,
  url,
  type,
  active,
  level,
  collapsed,
  toggleCollapsed,
}) => {
  const K = ({ href, children, ...props }) => {
    if (type == "FOLDER") {
      return (
        <button onClick={() => toggleCollapsed()} {...props}>
          <span
            className={`flex items-center py-3 pr-3 transition dark:text-neutral-400`}
          >
            <svg
              fill="currentColor"
              className={`h-2.5 w-2.5 ${
                collapsed ? `-rotate-90 transform` : ``
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"></path>
            </svg>
          </span>
          {children}
        </button>
      )
    } else
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
  }

  return (
    <EditorContextMenuWrapper>
      <K
        href={url}
        className={cn(
          `flex h-8 w-full grow items-center whitespace-nowrap rounded-md px-3 text-xs transition duration-100`,
          active && type == "FILE"
            ? ` bg-gray-3   duration-200`
            : `hover:bg-gray-2`
        )}
      >
        {title}
        {label && <Label text={label} />}
      </K>
    </EditorContextMenuWrapper>
  )
}

export const Node: FC<{ node: TreeNode; level: number }> = ({
  node,
  level,
}) => {
  // const Tree = dynamic(() => import("./tree"), { loading: () => <>loading</> })
  const params = useParams()
  const currentPath = usePathname()
  const activeFilePath = params.segments
    ? typeof params.segments == "string"
      ? params.segments
      : params.segments.join("/")
    : "/"
  const [collapsed, setCollapsed] = useState<boolean>(true)

  useEffect(() => {
    activeFilePath.includes(node.path) && setCollapsed(false)
  }, [activeFilePath, node.path])

  return (
    <>
      <NavLink
        title={
          node.type == "FILE"
            ? node.title.split(".").slice(0, -1).join(".")
            : node.title
        }
        // label={node.label || undefined}
        url={
          currentPath.replace("/" + decodeURIComponent(activeFilePath), "") +
          "/" +
          node.urlPath
        }
        type={node.type}
        active={
          decodeURIComponent(activeFilePath).replaceAll("+", " ") == node.path
        }
        level={level}
        collapsed={collapsed}
        toggleCollapsed={() => setCollapsed((collapsed) => !collapsed)}
      />

      <Suspense
        fallback={
          <div className="ml-3 flex items-center gap-1 pl-3 text-xs text-gray-11">
            <Loader2 className="animate-spin" size={20} /> Loading...
          </div>
        }
      >
        {node.type == "FOLDER" && !collapsed && (
          <Tree tree={node.children} level={level + 1} path={node.path} />
        )}
      </Suspense>
    </>
  )
}
