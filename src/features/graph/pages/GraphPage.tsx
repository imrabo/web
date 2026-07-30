"use client"

import { useCallback, useEffect } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from "@xyflow/react"

import type { Node, Edge } from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import "./graph.css"

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "React" },
  },
  {
    id: "2",
    position: { x: 250, y: -150 },
    data: { label: "Next.js" },
  },
  {
    id: "3",
    position: { x: 250, y: 150 },
    data: { label: "TypeScript" },
  },
  {
    id: "4",
    position: { x: 520, y: 0 },
    data: { label: "Tailwind CSS" },
  },
  {
    id: "5",
    position: { x: -250, y: 150 },
    data: { label: "Node.js" },
  },
  {
    id: "6",
    position: { x: 750, y: -120 },
    data: { label: "shadcn/ui" },
  },
  {
    id: "7",
    position: { x: 750, y: 120 },
    data: { label: "Supabase" },
  },
]

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "1-3",
    source: "1",
    target: "3",
  },
  {
    id: "2-4",
    source: "2",
    target: "4",
  },
  {
    id: "3-4",
    source: "3",
    target: "4",
  },
  {
    id: "5-1",
    source: "5",
    target: "1",
  },
  {
    id: "4-6",
    source: "4",
    target: "6",
  },
  {
    id: "4-7",
    source: "4",
    target: "7",
  },
]

function Flow() {
  const { fitView } = useReactFlow()

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    requestAnimationFrame(() => {
      fitView({
        padding: 0.25,
        duration: 600,
      })
    })

    const resize = () =>
      fitView({
        padding: 0.25,
        duration: 300,
      })

    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }, [fitView])

  const onInit = useCallback(() => {
    fitView({
      padding: 0.25,
      duration: 600,
    })
  }, [fitView])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      minZoom={0.05}
      maxZoom={5}
      nodesDraggable
      nodesFocusable={false}
      nodesConnectable={false}
      elementsSelectable
      panOnDrag
      panOnScroll
      zoomOnScroll
      zoomOnPinch
      zoomOnDoubleClick
      selectionOnDrag={false}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: {
          stroke: "#555",
          strokeWidth: 1,
        },
      }}
      proOptions={{
        hideAttribution: true,
      }}
    />
  )
}

export default function GraphPage() {
  return (
    <ReactFlowProvider>
      <div className="graph-container">
        <Flow />
      </div>
    </ReactFlowProvider>
  )
}
