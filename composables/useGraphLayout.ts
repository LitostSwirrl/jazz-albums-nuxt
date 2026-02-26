import { computed } from 'vue'
import dagre from 'dagre'
import type { GraphNode, GraphEdge } from './useInfluenceGraph'

interface LayoutOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL'
  nodeSpacing?: number
  rankSpacing?: number
}

const nodeSizeMap = {
  sm: { width: 140, height: 70 },
  md: { width: 160, height: 80 },
  lg: { width: 180, height: 90 },
  xl: { width: 200, height: 100 },
}

export function useGraphLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  options: LayoutOptions = {},
) {
  const { direction = 'TB', nodeSpacing = 50, rankSpacing = 100 } = options

  return computed(() => {
    if (nodes.length === 0) {
      return { nodes: [], edges }
    }

    const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

    g.setGraph({
      rankdir: direction,
      nodesep: nodeSpacing,
      ranksep: rankSpacing,
      marginx: 50,
      marginy: 50,
    })

    nodes.forEach((node) => {
      const size = nodeSizeMap[node.data.size]
      g.setNode(node.id, { width: size.width, height: size.height })
    })

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target)
    })

    dagre.layout(g)

    const layoutedNodes = nodes.map((node) => {
      const position = g.node(node.id)
      const size = nodeSizeMap[node.data.size]

      return {
        ...node,
        position: {
          x: position.x - size.width / 2,
          y: position.y - size.height / 2,
        },
      }
    })

    return { nodes: layoutedNodes, edges }
  })
}
