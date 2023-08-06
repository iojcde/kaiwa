"use client"

import React, { FC, useState, useEffect, use, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export type TreeNode = {
  id: string
  path:string
  title: string
  content?: string
  type: "Note" | "Folder"
  children?: TreeNode[]  
  childrenUrl?: string
  urlPath: string
}
const NavLink: FC<{
  title: string
  label?: string
  url?: string
  level: number
  activePath: string
  collapsible: boolean
  collapsed: boolean
  toggleCollapsed: () => void
}> = ({
  title,
  label,
  url,
  level,
  activePath,
  collapsible,
  collapsed,
  toggleCollapsed,
}) => {
  const K = ({ href, ...props }) => {
    if (href) {
      return <Link href={href} {...props}></Link>
    } else return <div {...props} />
  }

  return (
    <div
      className={cn(
        `group flex h-8 items-center justify-between space-x-2 whitespace-nowrap rounded-md px-3 text-sm leading-none`,
        url == activePath
          ? `${
              level == 0 ? `font-medium` : `font-normal`
            } bg-neutral-100 text-black transition duration-200 dark:bg-neutral-500/20 dark:text-neutral-50`
          : `hover:bg-neutral-50 dark:hover:bg-[rgb(16,16,16)] ${
              level == 0
                ? `font-medium text-neutral-700 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-200`
                : `font-normal hover:text-neutral-600 dark:hover:text-neutral-300`
            }`
      )}
    >
      <K href={url} className="flex h-full grow items-center space-x-2">
        <span>{title}</span>
        {label && <Label text={label} />}
      </K>
      {collapsible && (
        <button
          aria-label="Toggle children"
          onClick={toggleCollapsed}
          className="mr-2 shrink-0 px-2 py-1"
        >
          <span
            className={`  flex   items-center dark:fill-neutral-400 ${
              collapsed ? `-rotate-90 transform` : ``
            }`}
          >
            <ChevronDown size={20} />
          </span>
        </button>
      )}
    </div>
  )
}

const Node: FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const activePath = usePathname()
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const toggleCollapsed = () => setCollapsed(!collapsed)

  useEffect(() => {
    if (
      activePath == node.urlPath ||
      (Array.isArray(node.children) &&
        node.children?.map((_) => _.urlPath).includes(activePath))
    ) {
      setCollapsed(false)
    }
  }, [])

  return (
    <>
      <NavLink
        title={node.title}
        // label={node.label || undefined}
        url={node.urlPath}
        level={level}
        activePath={activePath}
        collapsible={node.type == "Folder"}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <Suspense fallback={<>loading</>}>
        {node.children && !collapsed && (
          <Tree tree={node.children} level={level + 1} />
        )}
      </Suspense>
    </>
  )
}

export const Tree: FC<{ tree: TreeNode[]; level: number }> = ({
  tree,
  level,
}) => {
  return (
    <div
      className={cn(
        `ml-3 space-y-2 pl-3`,
        level > 0 ? `border-l border-neutral-200 dark:border-neutral-800` : ``
      )}
    >
      {tree.map((treeNode, index) => (
        <Node key={index} node={treeNode} level={level} />
      ))}
    </div>
  )
}
