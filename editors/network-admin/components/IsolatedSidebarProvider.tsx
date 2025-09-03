import React, { createContext, useContext, useReducer, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { SidebarNode } from '@powerhousedao/document-engineering';

// Create a completely isolated context for Network Admin sidebar
const NetworkAdminSidebarContext = createContext<any>(null);

// Initial state for the isolated sidebar
const initialSidebarState = {
  nodes: [],
  expandedNodes: new Set<string>(),
  activeNodeId: undefined,
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  activeSearchIndex: 0,
  pinnedNodePath: [],
  isStatusFilterEnabled: false,
};

// Action types for the isolated sidebar
const SidebarActionType = {
  SET_NODES: 'SET_NODES',
  TOGGLE_NODE: 'TOGGLE_NODE',
  SET_ACTIVE_NODE: 'SET_ACTIVE_NODE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_IS_SEARCHING: 'SET_IS_SEARCHING',
  SET_ACTIVE_SEARCH_INDEX: 'SET_ACTIVE_SEARCH_INDEX',
  SET_PINNED_NODE_PATH: 'SET_PINNED_NODE_PATH',
  TOGGLE_STATUS_FILTER: 'TOGGLE_STATUS_FILTER',
  OPEN_NODE: 'OPEN_NODE',
  CLOSE_NODE: 'CLOSE_NODE',
  SET_EXPANDED_NODES: 'SET_EXPANDED_NODES',
} as const;

// Reducer for the isolated sidebar
const networkAdminSidebarReducer = (state: any, action: any) => {
  switch (action.type) {
    case SidebarActionType.SET_NODES:
      return { ...state, nodes: action.payload };
    case SidebarActionType.TOGGLE_NODE:
      const newExpandedNodes = new Set(state.expandedNodes);
      if (newExpandedNodes.has(action.payload)) {
        newExpandedNodes.delete(action.payload);
      } else {
        newExpandedNodes.add(action.payload);
      }
      return { ...state, expandedNodes: newExpandedNodes };
    case SidebarActionType.SET_ACTIVE_NODE:
      return { ...state, activeNodeId: action.payload };
    case SidebarActionType.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case SidebarActionType.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    case SidebarActionType.SET_IS_SEARCHING:
      return { ...state, isSearching: action.payload };
    case SidebarActionType.SET_PINNED_NODE_PATH:
      return { ...state, pinnedNodePath: action.payload };
    case SidebarActionType.TOGGLE_STATUS_FILTER:
      return { ...state, isStatusFilterEnabled: !state.isStatusFilterEnabled };
    case SidebarActionType.OPEN_NODE:
      const openExpandedNodes = new Set(state.expandedNodes);
      openExpandedNodes.add(action.payload);
      return { ...state, expandedNodes: openExpandedNodes };
    case SidebarActionType.CLOSE_NODE:
      const closeExpandedNodes = new Set(state.expandedNodes);
      closeExpandedNodes.delete(action.payload);
      return { ...state, expandedNodes: closeExpandedNodes };
    case SidebarActionType.SET_ACTIVE_SEARCH_INDEX:
      return { ...state, activeSearchIndex: action.payload };
    case SidebarActionType.SET_EXPANDED_NODES:
      return { ...state, expandedNodes: action.payload };
    default:
      return state;
  }
};

/**
 * Isolated SidebarProvider that doesn't interfere with other sidebars
 * Uses a completely separate React context and state management
 */
export const IsolatedSidebarProvider: React.FC<{
  children: React.ReactNode;
  nodes?: SidebarNode[];
}> = ({ children, nodes: initialNodes = [] }) => {
  const [state, dispatch] = useReducer(networkAdminSidebarReducer, {
    ...initialSidebarState,
    nodes: initialNodes,
  });

  const virtualListRef = useRef(null);
  const [onActiveNodeChange, setOnActiveNodeChange] = useState(() => () => undefined);

  const setNodes = useCallback((newNodes: SidebarNode[]) => {
    dispatch({ type: SidebarActionType.SET_NODES, payload: newNodes });
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    dispatch({ type: SidebarActionType.TOGGLE_NODE, payload: nodeId });
  }, []);

  const setActiveNodeId = useCallback((nodeId: string | undefined) => {
    dispatch({ type: SidebarActionType.SET_ACTIVE_NODE, payload: nodeId });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: SidebarActionType.SET_SEARCH_TERM, payload: term });
  }, []);

  const setSearchResults = useCallback((results: any[]) => {
    dispatch({ type: SidebarActionType.SET_SEARCH_RESULTS, payload: results });
  }, []);

  const setIsSearching = useCallback((isSearching: boolean) => {
    dispatch({ type: SidebarActionType.SET_IS_SEARCHING, payload: isSearching });
  }, []);

  const setActiveSearchIndex = useCallback((index: number) => {
    dispatch({ type: SidebarActionType.SET_ACTIVE_SEARCH_INDEX, payload: index });
  }, []);

  const nextSearchResult = useCallback(() => {
    if (state.searchResults.length > 0) {
      const nextIndex = Math.min(state.searchResults.length - 1, state.activeSearchIndex + 1);
      setActiveSearchIndex(nextIndex);
    }
  }, [state.searchResults.length, state.activeSearchIndex, setActiveSearchIndex]);

  const previousSearchResult = useCallback(() => {
    if (state.searchResults.length > 0) {
      const prevIndex = Math.max(0, state.activeSearchIndex - 1);
      setActiveSearchIndex(prevIndex);
    }
  }, [state.searchResults.length, state.activeSearchIndex, setActiveSearchIndex]);

  const setPinnedNodePath = useCallback((path: any[]) => {
    dispatch({ type: SidebarActionType.SET_PINNED_NODE_PATH, payload: path });
  }, []);

  const toggleStatusFilter = useCallback(() => {
    dispatch({ type: SidebarActionType.TOGGLE_STATUS_FILTER });
  }, []);

  const openNode = useCallback((nodeId: string) => {
    dispatch({ type: SidebarActionType.OPEN_NODE, payload: nodeId });
  }, []);

  const closeNode = useCallback((nodeId: string) => {
    dispatch({ type: SidebarActionType.CLOSE_NODE, payload: nodeId });
  }, []);

  const setExpandedNodes = useCallback((nodes: Set<string>) => {
    dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: nodes });
  }, []);

  const setActiveNodeChangeCallback = useCallback((callback: any) => {
    setOnActiveNodeChange(() => callback);
  }, []);

  const syncActiveNodeId = useCallback((nodeId: string) => {
    dispatch({ type: SidebarActionType.SET_ACTIVE_NODE, payload: nodeId });
  }, []);

  // Update nodes when initialNodes change
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  // Calculate flattened nodes
  const flattenedNodes = useMemo(() => {
    const flattened: any[] = [];
    const dfs = (node: any, depth: number) => {
      const flatNode = {
        ...node,
        depth,
        isExpanded: state.expandedNodes.has(node.id),
      };
      flattened.push(flatNode);
      if (Array.isArray(node.children) && state.expandedNodes.has(node.id)) {
        for (const child of node.children) {
          dfs(child, depth + 1);
        }
      }
    };
    for (const node of state.nodes) {
      dfs(node, 0);
    }
    return flattened;
  }, [state.nodes, state.expandedNodes]);

  // Calculate max depth
  const maxDepth = useMemo(() => {
    const getMaxDepth = (nodes: any[], currentLevel: number = 0): number => {
      if (!nodes || nodes.length === 0) return currentLevel;
      let max = currentLevel;
      
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          const childDepth = getMaxDepth(node.children, currentLevel + 1);
          max = Math.max(max, childDepth);
        }
      }
      return max;
    };
    const depth = getMaxDepth(state.nodes, 0);
    // Return depth count (number of levels) instead of level number (0-based index)
    const depthCount = depth + 1;
    return depthCount;
  }, [state.nodes]);

  // Utility function to check if a level is open
  const isOpenLevel = useCallback((items: any[], expandedNodes: Set<string>, level: number): boolean => {
    if (!items.length || level < 1) {
      return false;
    }
    
    // Check if all levels up to the target level are open
    const queue = [...items];
    for (let i = 0; i < level; i++) {
      const nextLevelQueue = [];
      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        
        // Check if current level is expanded
        if (!expandedNodes.has(current.id)) {
          return false;
        }
        
        // Add children to next level queue
        if (current.children?.length) {
          nextLevelQueue.push(...current.children);
        }
      }
      
      // Move to next level
      queue.push(...nextLevelQueue);
      if (queue.length === 0) break;
    }
    
    return true;
  }, []);

  // Utility function to get nodes that should be expanded for a specific level
  const getOpenLevels = useCallback((items: any[], level: number): Set<string> => {
    if (level < 1) {
      return new Set();
    }
    
    const result = new Set<string>();
    
    const traverse = (nodes: any[], currentLevel: number) => {
      for (const node of nodes) {
        // Add current node if we're not at the target level yet
        if (currentLevel < level) {
          result.add(node.id);
        }
        
        // Continue traversing children if we haven't reached the target level
        if (node.children?.length && currentLevel < level - 1) {
          traverse(node.children, currentLevel + 1);
        }
      }
    };
    
    traverse(items, 0); // Start from level 0 (root)
    return result;
  }, []);

  const openLevel = useCallback((targetLevel: number) => {
    // Check if the target level is currently visible by checking if nodes at that level are expanded
    const isTargetLevelVisible = (() => {
      if (targetLevel === 1) {
        // For level 1, check if root nodes are expanded
        return state.nodes.every((node: any) => state.expandedNodes.has(node.id));
      } else if (targetLevel === 2) {
        // For level 2, check if folder nodes are expanded
        const folderNodes = state.nodes.flatMap((node: any) => node.children || []);
        return folderNodes.length > 0 && folderNodes.every((folder: any) => state.expandedNodes.has(folder.id));
      } else if (targetLevel === 3) {
        // For level 3, check if document nodes are expanded
        const documentNodes = state.nodes.flatMap((node: any) => 
          (node.children || []).flatMap((folder: any) => folder.children || [])
        );
        return documentNodes.length > 0 && documentNodes.every((doc: any) => state.expandedNodes.has(doc.id));
      }
      return false;
    })();
    
    if (isTargetLevelVisible) {
      // If the target level is visible, hide it by closing nodes at that level
      if (targetLevel === 1) {
        // Close root nodes
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => newExpandedNodes.delete(node.id));
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      } else if (targetLevel === 2) {
        // Close folder nodes
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => {
          if (node.children) {
            node.children.forEach((folder: any) => newExpandedNodes.delete(folder.id));
          }
        });
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      } else if (targetLevel === 3) {
        // Close document nodes
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => {
          if (node.children) {
            node.children.forEach((folder: any) => {
              if (folder.children) {
                folder.children.forEach((doc: any) => newExpandedNodes.delete(doc.id));
              }
            });
          }
        });
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      }
    } else {
      // If the target level is not visible, show it by opening nodes at that level
      if (targetLevel === 1) {
        // Open root nodes
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => newExpandedNodes.add(node.id));
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      } else if (targetLevel === 2) {
        // Open folder nodes (and root nodes if not already open)
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => {
          newExpandedNodes.add(node.id); // Ensure root is open
          if (node.children) {
            node.children.forEach((folder: any) => newExpandedNodes.add(folder.id));
          }
        });
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      } else if (targetLevel === 3) {
        // Open document nodes (and root + folder nodes if not already open)
        const newExpandedNodes = new Set(state.expandedNodes);
        state.nodes.forEach((node: any) => {
          newExpandedNodes.add(node.id); // Ensure root is open
          if (node.children) {
            node.children.forEach((folder: any) => {
              newExpandedNodes.add(folder.id); // Ensure folder is open
              if (folder.children) {
                folder.children.forEach((doc: any) => newExpandedNodes.add(doc.id));
              }
            });
          }
        });
        dispatch({ type: SidebarActionType.SET_EXPANDED_NODES, payload: newExpandedNodes });
      }
    }
  }, [state.nodes, state.expandedNodes]);

  const contextValue = {
    nodes: state.nodes,
    flattenedNodes,
    expandedNodes: state.expandedNodes,
    pinnedNodePath: state.pinnedNodePath,
    maxDepth,
    searchTerm: state.searchTerm,
    searchResults: state.searchResults,
    isSearching: state.isSearching,
    activeSearchIndex: state.activeSearchIndex,
    isStatusFilterEnabled: state.isStatusFilterEnabled,
    virtualListRef,
    activeNodeId: state.activeNodeId,
    toggleNode,
    openNode,
    closeNode,
    togglePin: () => {}, // Simplified for now
    openLevel,
    changeSearchTerm: setSearchTerm,
    nextSearchResult,
    previousSearchResult,
    setNodes,
    syncActiveNodeId,
    onActiveNodeChange,
    setActiveNodeChangeCallback,
    toggleStatusFilter,
    setSearchTerm,
    setSearchResults,
    setIsSearching,
    setActiveSearchIndex,
    setExpandedNodes,
  };

  return (
    <NetworkAdminSidebarContext.Provider value={contextValue}>
      {children}
    </NetworkAdminSidebarContext.Provider>
  );
};

/**
 * Hook to use the isolated sidebar context
 */
export const useIsolatedSidebar = () => {
  const context = useContext(NetworkAdminSidebarContext);
  if (!context) {
    throw new Error('useIsolatedSidebar must be used within IsolatedSidebarProvider');
  }
  return context;
};
