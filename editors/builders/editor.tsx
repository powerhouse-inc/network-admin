import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { useSelectedBuildersDocument } from "../../document-models/builders/hooks.js";
import type { BuildersDocument } from "../../document-models/builders/index.js";
import type { Action } from "document-model";
import { actions as buildersActions } from "../../document-models/builders/actions.js";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
  useDocumentsInSelectedDrive,
  useDrives,
  useGetDocuments,
} from "@powerhousedao/reactor-browser";
import { useMemo, useCallback } from "react";
import type { FileNode } from "document-drive";
import {
  ObjectSetTable,
  type ColumnDef,
  type ColumnAlignment,
  PHIDInput,
} from "@powerhousedao/document-engineering";

type Builder = {
  phid: string;
  name: string;
  slug: string;
  icon: string;
};

/** Implement your editor behavior here */
export default function Editor() {
  const [doc, dispatch] = useSelectedBuildersDocument() as [
    BuildersDocument,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];
  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();
  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  const drives = useDrives();
  // Map all builder profile FileNodes from all drives with their driveId
  const builderProfileNodesWithDriveId = useMemo(() => {
    if (!drives) return [];
    return drives.flatMap((drive) => {
      const builderProfileNodes = drive.state.global.nodes.filter(
        (node): node is FileNode =>
          node.kind === "file" &&
          "documentType" in node &&
          node.documentType === "powerhouse/builder-profile",
      );
      return builderProfileNodes.map((node) => ({
        node,
        driveId: drive.header.id,
      }));
    });
  }, [drives]);

  // Get all unique builder PHIDs from the nodes
  const builderPhids = useMemo(() => {
    return builderProfileNodesWithDriveId.map(({ node }) => node.id);
  }, [builderProfileNodesWithDriveId]);

  // Fetch all builder profile documents from all drives
  const builderProfileDocuments = useGetDocuments(builderPhids);

  // Create a map of PHID to document for quick lookup
  const builderProfileMap = useMemo(() => {
    if (!builderProfileDocuments) return new Map();
    const map = new Map();
    builderProfileDocuments.forEach((doc) => {
      if (doc.header.documentType === "powerhouse/builder-profile") {
        map.set(doc.header.id, doc);
      }
    });
    return map;
  }, [builderProfileDocuments]);

  // Helper function to get builder profile documents from all drives
  const getBuilderProfiles = useCallback(() => {
    return builderProfileNodesWithDriveId.map(({ node }) => {
      const doc = builderProfileMap.get(node.id);
      const name = doc?.state?.global?.name || node.name || node.id;
      return {
        id: node.id,
        label: name,
        value: node.id,
        title: name,
      };
    });
  }, [builderProfileNodesWithDriveId, builderProfileMap]);

  // Helper function to get builder profile data by PHID from all drives
  const getBuilderProfileByPhid = (phid: string) => {
    const doc = builderProfileMap.get(phid);
    if (!doc) return null;

    return {
      name: doc.state.global?.name || doc.header.id,
      slug: doc.state.global?.slug || doc.header.id,
      icon: doc.state.global?.icon || null,
    };
  };

  const builders = useMemo(() => {
    return doc?.state.global.builders.map((phid) => ({
      phid: phid,
      name: getBuilderProfileByPhid(phid)?.name || "",
      slug: getBuilderProfileByPhid(phid)?.slug || "",
      icon: getBuilderProfileByPhid(phid)?.icon || null,
    }));
  }, [doc, builderProfileMap]);

  const columns = useMemo<Array<ColumnDef<Builder>>>(
    () => [
      {
        field: "phid",
        title: "PHID",
        editable: true,
        align: "center" as ColumnAlignment,
        width: 200,
        onSave: (newValue, context) => {
          const currentId = context.row.phid || "";
          if (newValue !== currentId && newValue && currentId) {
            // First remove the old agent
            dispatch(buildersActions.removeBuilder({ builderPhid: currentId }));
            // Then add the new agent with the new PHID
            dispatch(
              buildersActions.addBuilder({
                builderPhid: newValue as string,
              }),
            );
            return true;
          }
          return false;
        },
        renderCellEditor: (value, onChange, context) => (
          <PHIDInput
            value={(value as string) || ""}
            onChange={(newValue) => {
              onChange(newValue);
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              const currentValue = (value as string) || "";

              // If a PHID is entered and it's different from current value
              if (newValue && newValue !== currentValue) {
                const builderProfile = getBuilderProfileByPhid(newValue);
                const existingBuilder = builders?.find(
                  (builder) => builder?.phid === newValue,
                );

                if (!existingBuilder) {
                  // If we're editing an existing row (has an ID), remove the old one first
                  if (context.row.phid && context.row.phid !== newValue) {
                    dispatch(
                      buildersActions.removeBuilder({
                        builderPhid: context.row.phid,
                      }),
                    );
                  }

                  if (builderProfile) {
                    // Create new agent with data from builder profile
                    dispatch(
                      buildersActions.addBuilder({
                        builderPhid: newValue,
                      }),
                    );
                  } else {
                    // Manual PHID entry - create agent with empty data that user can fill
                    dispatch(
                      buildersActions.addBuilder({
                        builderPhid: newValue,
                      }),
                    );
                  }
                }
              }
            }}
            placeholder="Enter PHID"
            className="w-full"
            variant="withValueAndTitle"
            initialOptions={getBuilderProfiles()}
            fetchOptionsCallback={async (userInput: string) => {
              const builderProfiles = getBuilderProfiles();

              // Filter profiles based on user input
              if (!userInput.trim()) {
                return builderProfiles;
              }

              const filteredProfiles = builderProfiles.filter(
                (profile) =>
                  profile.label
                    .toLowerCase()
                    .includes(userInput.toLowerCase()) ||
                  profile.id.toLowerCase().includes(userInput.toLowerCase()),
              );

              return filteredProfiles;
            }}
          />
        ),
        renderCell: (value) => {
          if (value === "" || !value) {
            return (
              <div className="font-light italic text-gray-500 text-center">
                + Double-click to add new builder (enter or click outside to
                save)
              </div>
            );
          }
          return <div className="text-center font-mono text-sm">{value}</div>;
        },
      },
      {
        field: "name",
        title: "Builder Name",
        editable: false,
        align: "center" as ColumnAlignment,
        width: 200,
        renderCell: (value) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        field: "slug",
        title: "Builder Slug",
        editable: false,
        align: "center" as ColumnAlignment,
        width: 200,
        renderCell: (value) => {
          return <div className="text-center">{value}</div>;
        },
      },
      {
        field: "icon",
        title: "Icon",
        editable: false,
        align: "center" as ColumnAlignment,
        width: 150,
        renderCell: (value, context) => {
          if (!context.row.icon) {
            return null;
          }
          return (
            <div className="text-center">
              <img
                src={context.row.icon}
                alt="Agent icon"
                className="w-10 h-10 rounded-sm mx-auto object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
            </div>
          );
        },
      },
    ],
    [builders, builderProfileMap, getBuilderProfiles],
  );

  return (
    <div className="w-full bg-gray-50">
      <DocumentToolbar document={doc} onClose={handleClose} />
      <div className="p-2 max-w-4xl mx-auto min-h-screen">
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Builders</h1>
        </div>
        <div className="mt-4 bg-white">
          <ObjectSetTable
            columns={columns}
            data={builders || []}
            allowRowSelection={true}
            onDelete={(data) => {
              if (data.length > 0) {
                data.forEach((d) => {
                  dispatch(
                    buildersActions.removeBuilder({ builderPhid: d.phid }),
                  );
                });
              }
            }}
            onAdd={(data) => {
              // Only add if we have a title (name) - PHID will be handled by the PHIDInput onChange
              if (data.title) {
                // Generate a temporary ID if no PHID is provided
                const tempId = (data as any).id || `temp-${Date.now()}`;
                dispatch(
                  buildersActions.addBuilder({
                    builderPhid: tempId,
                  }),
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
