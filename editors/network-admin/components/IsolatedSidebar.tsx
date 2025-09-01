import React, { useState, useRef, useCallback } from "react";
import { Icon } from "@powerhousedao/document-engineering";
import { useIsolatedSidebar } from "./IsolatedSidebarProvider.js";

/**
 * Isolated Sidebar component that uses our custom context instead of the global one
 * This prevents interference with other sidebars in the application
 */
export const IsolatedSidebar: React.FC<{
  nodes: any[];
  activeNodeId?: string;
  onActiveNodeChange?: (nodeId: string) => void;
  sidebarTitle?: string;
  showSearchBar?: boolean;
  allowPinning?: boolean;
  resizable?: boolean;
  initialWidth?: number;
  maxWidth?: number;
  enableMacros?: number;
  handleOnTitleClick?: () => void;
  // Additional props to match original Sidebar
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  nodes,
  activeNodeId,
  onActiveNodeChange,
  sidebarTitle = "Network Admin",
  showSearchBar = true,
  allowPinning = true,
  resizable = true,
  initialWidth = 300,
  maxWidth = 500,
  enableMacros = 3,
  handleOnTitleClick,
  className,
  style,
  children,
}) => {
  const sidebarContext = useIsolatedSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      sidebarContext.toggleNode(nodeId);
      if (onActiveNodeChange) {
        onActiveNodeChange(nodeId);
      }
    },
    [sidebarContext, onActiveNodeChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);

      // Simple search implementation
      if (term.trim() === "") {
        sidebarContext.setSearchResults([]);
        sidebarContext.setIsSearching(false);
        sidebarContext.setActiveSearchIndex(0);
      } else {
        sidebarContext.setIsSearching(true);
        // Filter nodes based on search term
        const searchInNodes = (nodes: any[], searchTerm: string): any[] => {
          const results: any[] = [];
          for (const node of nodes) {
            const nodeName = node.name || node.title || "";
            if (
              nodeName &&
              nodeName.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              results.push(node);
            }
            if (node.children && node.children.length > 0) {
              results.push(...searchInNodes(node.children, searchTerm));
            }
          }
          return results;
        };

        const searchResults = searchInNodes(nodes, term);
        sidebarContext.setSearchResults(searchResults);
        sidebarContext.setIsSearching(false);
        sidebarContext.setActiveSearchIndex(0);
      }
    },
    [sidebarContext, nodes]
  );

  const renderNode = (node: any, depth: number = 0) => {
    const isActive = activeNodeId === node.id;
    const isExpanded = sidebarContext.expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    // Check if this node is the active search result
    const isSearchActive =
      sidebarContext.searchResults.length > 0 &&
      sidebarContext.searchResults[sidebarContext.activeSearchIndex]?.id ===
        node.id;

    // Check if this node matches the search term
    const nodeName = node.name || node.title || "";
    const matchesSearch =
      searchTerm && nodeName.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 rounded-md mx-2 ${
            isActive
              ? "bg-blue-100 text-blue-600"
              : isSearchActive
                ? "bg-yellow-100 dark:bg-[#604B0033] text-gray-700"
                : "text-gray-700"
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => handleNodeClick(node.id)}
        >
          {hasChildren && (
            <button
              className="mr-2 p-1 hover:bg-gray-300 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                sidebarContext.toggleNode(node.id);
              }}
            >
              <Icon
                name={isExpanded ? "ChevronDown" : "CaretRight"}
                size={12}
                className="text-gray-500"
              />
            </button>
          )}
          {!hasChildren && <div className="w-6 mr-2" />}
          <span className="text-sm truncate font-medium">
            {matchesSearch && searchTerm ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: nodeName.replace(
                    new RegExp(searchTerm, "gi"),
                    (match: string) =>
                      `<span class="bg-yellow-300 dark:bg-[#604B00]">${match}</span>`
                  ),
                }}
              />
            ) : (
              nodeName
            )}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredNodes = searchTerm
    ? sidebarContext.searchResults.length > 0
      ? sidebarContext.searchResults
      : nodes.filter((node: any) => {
          const nodeName = node.name || node.title || "";
          return (
            nodeName &&
            nodeName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
    : nodes;

  // Don't render anything when collapsed, just the toggle button
  if (isCollapsed) {
    return (
      <div className="relative">
        {/* Collapse button - positioned on right edge when collapsed */}
        {resizable && (
          <div className="group/sidebar-resizer absolute right-0 top-0 h-full w-[24px] translate-x-1/2 cursor-ew-resize select-none">
            <div className="relative h-full w-px translate-x-[12px] transition-colors group-hover/sidebar-resizer:bg-gray-500 dark:group-hover/sidebar-resizer:bg-gray-600">
              <button
                type="button"
                className="absolute right-0 top-14 size-4 translate-x-1/2 rounded-full bg-gray-500 dark:bg-gray-900 opacity-100"
                onClick={handleToggleCollapse}
                title="Expand sidebar"
              >
                <Icon
                  name="Caret"
                  size={16}
                  className="min-w-4 text-gray-50 dark:text-gray-500"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={sidebarRef}
      className={`group peer relative flex h-full flex-col bg-gray-50 shadow-lg transition-[width] duration-75 ease-linear dark:bg-slate-600 ${className || ""}`}
      style={{
        width: initialWidth,
        minWidth: resizable ? 200 : initialWidth,
        maxWidth: resizable ? maxWidth : initialWidth,
        ...style,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-800 dark:bg-slate-600">
        {!isCollapsed && (
          <div className="flex items-center gap-2 truncate">
            <h2
              className="truncate text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-600"
              onClick={handleOnTitleClick}
            >
              {sidebarTitle}
            </h2>
          </div>
        )}

        {/* Macro buttons */}
        {!isCollapsed && enableMacros > 0 && (
          <div className="flex select-none items-center gap-2">
            {Array.from({ length: Math.min(enableMacros, 4) }).map(
              (_, index) => {
                const isDisabled = index + 1 > sidebarContext.maxDepth;
                return (
                  <div
                    key={`macro-${index}`}
                    role="button"
                    tabIndex={2}
                    className={`w-[26px] rounded-lg p-1 text-center text-xs ${
                      !isDisabled
                        ? "bg-slate-50 text-slate-100 hover:bg-slate-100 hover:text-slate-200 dark:bg-gray-900 dark:text-slate-200 dark:hover:bg-gray-600 dark:hover:text-slate-50"
                        : "cursor-not-allowed bg-gray-100 text-[#E2E4E7] dark:bg-[#252728] dark:text-slate-500"
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        // Open level functionality
                        const openLevel = (targetLevel: number) => {
                          const isTargetLevelOpen = targetLevel === 1;
                          if (isTargetLevelOpen) {
                            sidebarContext.setExpandedNodes(new Set());
                          } else {
                            // Get nodes at the target level
                            const getNodesAtLevel = (
                              nodes: any[],
                              level: number,
                              currentLevel: number = 0
                            ): string[] => {
                              if (currentLevel === level) {
                                return nodes.map((node) => node.id);
                              }
                              const result: string[] = [];
                              for (const node of nodes) {
                                if (node.children && node.children.length > 0) {
                                  result.push(
                                    ...getNodesAtLevel(
                                      node.children,
                                      level,
                                      currentLevel + 1
                                    )
                                  );
                                }
                              }
                              return result;
                            };
                            const targetNodes = getNodesAtLevel(
                              sidebarContext.nodes,
                              index + 1
                            );
                            sidebarContext.setExpandedNodes(
                              new Set(targetNodes)
                            );
                          }
                        };
                        openLevel(index + 1);
                      }
                    }}
                  >
                    {index + 1}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {filteredNodes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Icon
                name="FolderOpen"
                size={24}
                className="mx-auto mb-2 text-gray-300"
              />
              <p className="text-sm">This node is empty</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredNodes.map((node: any) => renderNode(node))}
            </div>
          )}
        </div>
      )}

      {/* Search Bar - Fixed at bottom */}
      {!isCollapsed && showSearchBar && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      )}

              {/* Children content */}
        {children}
 
        {/* Collapse button - positioned on right edge like original */}
        {resizable && (
          <div className="group/sidebar-resizer absolute right-0 top-0 h-full w-[24px] translate-x-1/2 cursor-ew-resize select-none">
            <div className="relative h-full w-px translate-x-[12px] transition-colors group-hover/sidebar-resizer:bg-gray-500 dark:group-hover/sidebar-resizer:bg-gray-600">
              <button
                type="button"
                className="absolute right-0 top-14 size-4 translate-x-1/2 rounded-full bg-gray-500 dark:bg-gray-900 opacity-0 group-hover/sidebar-resizer:opacity-100 transition-opacity"
                onClick={handleToggleCollapse}
                title="Collapse sidebar"
              >
                <Icon
                  name="Caret"
                  size={16}
                  className="min-w-4 text-gray-50 dark:text-gray-500 -rotate-180"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    );
};
