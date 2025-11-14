#!/usr/bin/env bun

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 6) {
  console.error('Usage: bun mirror_sow_state.ts <remote-mcp-url> <remote-sow-id> <remote-drive-id> <local-mcp-url> <local-sow-id> <local-drive-id>');
  console.error('');
  console.error('Example:');
  console.error('  bun mirror_sow_state.ts \\');
  console.error('    https://switchboard-dev.powerhouse.xyz/mcp \\');
  console.error('    65f3e7e8-500d-4c42-9e73-8cd5d7966cd8 \\');
  console.error('    powerhouse-network-admin \\');
  console.error('    http://localhost:4001/mcp \\');
  console.error('    3471233d-c481-4214-afe3-c196b5a7778f \\');
  console.error('    bai-network-admin');
  process.exit(1);
}

const [REMOTE_MCP_URL, REMOTE_DOC_ID, REMOTE_DRIVE_ID, LOCAL_MCP_URL, LOCAL_DOC_ID, LOCAL_DRIVE_ID] = args;

// Types
interface MCPRequest {
  jsonrpc: string;
  method: string;
  params: {
    name: string;
    arguments: Record<string, any>;
  };
  id: number;
}

interface MCPResponse {
  result?: {
    structuredContent: any;
  };
  error?: any;
}

// Helper function to make MCP requests
async function mcpRequest(url: string, payload: MCPRequest): Promise<MCPResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  // Handle SSE format (event: message\ndata: {...})
  if (text.includes('event: message')) {
    const lines = text.split('\n');
    const dataLine = lines.find(line => line.startsWith('data: '));
    if (dataLine) {
      const jsonData = dataLine.substring(6);
      return JSON.parse(jsonData);
    }
    throw new Error('No data line found in SSE response');
  }

  return JSON.parse(text);
}

// Fetch remote document
async function getRemoteDocument(): Promise<any> {
  console.log(`Fetching remote document (${REMOTE_DOC_ID}) from drive "${REMOTE_DRIVE_ID}"...`);
  const payload: MCPRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'getDocument',
      arguments: { id: REMOTE_DOC_ID }
    },
    id: 1
  };

  const response = await mcpRequest(REMOTE_MCP_URL, payload);
  if (response.error) {
    throw new Error(`Remote fetch error: ${JSON.stringify(response.error)}`);
  }

  return response.result!.structuredContent.document;
}

// Get current local document state
async function getLocalDocument(): Promise<any> {
  console.log(`Fetching local document (${LOCAL_DOC_ID}) from drive "${LOCAL_DRIVE_ID}"...`);
  const payload: MCPRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'getDocument',
      arguments: { id: LOCAL_DOC_ID }
    },
    id: 2
  };

  const response = await mcpRequest(LOCAL_MCP_URL, payload);
  if (response.error) {
    throw new Error(`Local fetch error: ${JSON.stringify(response.error)}`);
  }

  return response.result!.structuredContent.document;
}

// Generate actions to mirror remote state
function generateActions(remoteState: any, localState: any): any[] {
  const actions: any[] = [];

  // 1. Update basic scope of work details
  if (remoteState.title !== localState.title ||
      remoteState.description !== localState.description ||
      remoteState.status !== localState.status) {
    actions.push({
      type: 'EDIT_SCOPE_OF_WORK',
      scope: 'global',
      input: {
        title: remoteState.title,
        description: remoteState.description,
        status: remoteState.status
      }
    });
  }

  // 2. Add missing contributors
  const localContributorIds = new Set(localState.contributors.map((c: any) => c.id));
  remoteState.contributors.forEach((contributor: any) => {
    if (!localContributorIds.has(contributor.id)) {
      const input: any = {
        id: contributor.id,
        name: contributor.name
      };
      if (contributor.icon) input.icon = contributor.icon;
      if (contributor.description) input.description = contributor.description;

      actions.push({
        type: 'ADD_AGENT',
        scope: 'global',
        input
      });
    }
  });

  // 3. Add missing deliverables with all their data
  const localDeliverableIds = new Set(localState.deliverables.map((d: any) => d.id));

  remoteState.deliverables.forEach((deliverable: any) => {
    if (!localDeliverableIds.has(deliverable.id)) {
      // Add deliverable
      actions.push({
        type: 'ADD_DELIVERABLE',
        scope: 'global',
        input: {
          id: deliverable.id,
          owner: deliverable.owner || undefined,
          title: deliverable.title,
          code: deliverable.code,
          description: deliverable.description,
          status: deliverable.status
        }
      });

      // Set work progress
      if (deliverable.workProgress) {
        const progressInput: any = {};

        if (deliverable.workProgress.value !== undefined) {
          progressInput.percentage = deliverable.workProgress.value;
        } else if (deliverable.workProgress.total !== undefined) {
          progressInput.storyPoints = {
            total: deliverable.workProgress.total,
            completed: deliverable.workProgress.completed
          };
        } else if (deliverable.workProgress.done !== undefined) {
          progressInput.done = deliverable.workProgress.done;
        }

        if (Object.keys(progressInput).length > 0) {
          actions.push({
            type: 'SET_DELIVERABLE_PROGRESS',
            scope: 'global',
            input: {
              id: deliverable.id,
              workProgress: progressInput
            }
          });
        }
      }

      // Add key results
      if (deliverable.keyResults && deliverable.keyResults.length > 0) {
        deliverable.keyResults.forEach((kr: any) => {
          actions.push({
            type: 'ADD_KEY_RESULT',
            scope: 'global',
            input: {
              id: kr.id,
              deliverableId: deliverable.id,
              title: kr.title,
              link: kr.link
            }
          });
        });
      }

      // Set budget anchor if exists
      if (deliverable.budgetAnchor && deliverable.budgetAnchor.project) {
        actions.push({
          type: 'SET_DELIVERABLE_BUDGET_ANCHOR_PROJECT',
          scope: 'global',
          input: {
            deliverableId: deliverable.id,
            project: deliverable.budgetAnchor.project,
            unit: deliverable.budgetAnchor.unit,
            unitCost: deliverable.budgetAnchor.unitCost,
            quantity: deliverable.budgetAnchor.quantity,
            margin: deliverable.budgetAnchor.margin
          }
        });
      }
    }
  });

  // 4. Add projects if any
  if (remoteState.projects && remoteState.projects.length > 0) {
    const localProjectsMap = new Map<string, any>(localState.projects.map((p: any) => [p.id, p]));

    remoteState.projects.forEach((project: any) => {
      const localProject = localProjectsMap.get(project.id);

      if (!localProject) {
        // Project doesn't exist, add it
        actions.push({
          type: 'ADD_PROJECT',
          scope: 'global',
          input: {
            id: project.id,
            code: project.code,
            title: project.title,
            projectOwner: project.projectOwner || undefined,
            abstract: project.abstract || undefined,
            imageUrl: project.imageUrl || undefined,
            budgetType: project.budgetType || undefined,
            currency: project.currency || undefined,
            budget: project.budget || 0
          }
        });
      }

      // Add missing deliverables to project scope
      if (project.scope && project.scope.deliverables && project.scope.deliverables.length > 0) {
        const localDeliverables = new Set(
          ((localProject)?.scope?.deliverables) || []
        );

        project.scope.deliverables.forEach((deliverableId: string) => {
          if (!localDeliverables.has(deliverableId)) {
            const deliverable = remoteState.deliverables.find((d: any) => d.id === deliverableId);
            if (deliverable) {
              actions.push({
                type: 'ADD_DELIVERABLE_IN_SET',
                scope: 'global',
                input: {
                  projectId: project.id,
                  deliverableId: deliverableId
                }
              });
            }
          }
        });

        // Set project scope metadata (status and deliverablesCompleted)
        if (project.scope.status || project.scope.deliverablesCompleted) {
          actions.push({
            type: 'EDIT_DELIVERABLES_SET',
            scope: 'global',
            input: {
              projectId: project.id,
              status: project.scope.status || undefined,
              deliverablesCompleted: project.scope.deliverablesCompleted || undefined
            }
          });
        }
      }
    });
  }

  // 5. Add roadmaps if any
  if (remoteState.roadmaps && remoteState.roadmaps.length > 0) {
    const localRoadmapsMap = new Map<string, any>(localState.roadmaps.map((r: any) => [r.id, r]));

    remoteState.roadmaps.forEach((roadmap: any) => {
      const localRoadmap = localRoadmapsMap.get(roadmap.id);

      if (!localRoadmap) {
        actions.push({
          type: 'ADD_ROADMAP',
          scope: 'global',
          input: {
            id: roadmap.id,
            title: roadmap.title,
            slug: roadmap.slug || undefined,
            description: roadmap.description || undefined
          }
        });
      }

      // Add milestones for this roadmap
      if (roadmap.milestones && roadmap.milestones.length > 0) {
        const localMilestonesMap = new Map<string, any>(
          ((localRoadmap)?.milestones || []).map((m: any) => [m.id, m])
        );

        roadmap.milestones.forEach((milestone: any) => {
          const localMilestone = localMilestonesMap.get(milestone.id);

          if (!localMilestone) {
            actions.push({
              type: 'ADD_MILESTONE',
              scope: 'global',
              input: {
                id: milestone.id,
                roadmapId: roadmap.id,
                sequenceCode: milestone.sequenceCode || undefined,
                title: milestone.title,
                description: milestone.description || undefined,
                deliveryTarget: milestone.deliveryTarget || undefined
              }
            });
          }

          // Add coordinators for milestone
          if (milestone.coordinators && milestone.coordinators.length > 0) {
            const localCoordinators = new Set((localMilestone)?.coordinators || []);

            milestone.coordinators.forEach((coordinatorId: string) => {
              if (!localCoordinators.has(coordinatorId)) {
                actions.push({
                  type: 'ADD_COORDINATOR',
                  scope: 'global',
                  input: {
                    id: coordinatorId,
                    milestoneId: milestone.id
                  }
                });
              }
            });
          }

          // Add deliverables to milestone
          if (milestone.scope && milestone.scope.deliverables && milestone.scope.deliverables.length > 0) {
            const localMilestoneDeliverables = new Set(
              ((localMilestone)?.scope?.deliverables) || []
            );

            milestone.scope.deliverables.forEach((deliverableId: string) => {
              if (!localMilestoneDeliverables.has(deliverableId)) {
                actions.push({
                  type: 'ADD_DELIVERABLE_IN_SET',
                  scope: 'global',
                  input: {
                    milestoneId: milestone.id,
                    deliverableId: deliverableId
                  }
                });
              }
            });

            // Set milestone scope metadata
            if (milestone.scope.status || milestone.scope.deliverablesCompleted) {
              actions.push({
                type: 'EDIT_DELIVERABLES_SET',
                scope: 'global',
                input: {
                  milestoneId: milestone.id,
                  status: milestone.scope.status || undefined,
                  deliverablesCompleted: milestone.scope.deliverablesCompleted || undefined
                }
              });
            }
          }
        });
      }
    });
  }

  return actions;
}

// Send actions in batches
async function sendActions(actions: any[]): Promise<void> {
  const BATCH_SIZE = 50;
  const batches: any[][] = [];

  for (let i = 0; i < actions.length; i += BATCH_SIZE) {
    batches.push(actions.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nSending ${actions.length} actions in ${batches.length} batches...`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\nBatch ${i + 1}/${batches.length} (${batch.length} actions)...`);

    const payload: MCPRequest = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'addActions',
        arguments: {
          documentId: LOCAL_DOC_ID,
          actions: batch
        }
      },
      id: 1000 + i
    };

    try {
      const response = await mcpRequest(LOCAL_MCP_URL, payload);

      if (response.error) {
        console.error(`Error in batch ${i + 1}:`, JSON.stringify(response.error, null, 2));
        throw new Error(`Batch ${i + 1} failed`);
      }

      console.log(`✓ Batch ${i + 1} completed successfully`);
    } catch (error) {
      console.error(`Failed to send batch ${i + 1}:`, error);
      throw error;
    }
  }
}

// Main function
async function main() {
  try {
    console.log('='.repeat(70));
    console.log('Scope of Work State-Based Mirror Script');
    console.log('='.repeat(70));
    console.log('\nConfiguration:');
    console.log(`  Remote MCP: ${REMOTE_MCP_URL}`);
    console.log(`  Remote Drive: ${REMOTE_DRIVE_ID}`);
    console.log(`  Remote SoW ID: ${REMOTE_DOC_ID}`);
    console.log(`  Local MCP: ${LOCAL_MCP_URL}`);
    console.log(`  Local Drive: ${LOCAL_DRIVE_ID}`);
    console.log(`  Local SoW ID: ${LOCAL_DOC_ID}`);
    console.log('');

    // Fetch remote document
    const remoteDoc = await getRemoteDocument();
    const remoteState = remoteDoc.state.global;
    console.log(`✓ Remote document fetched: "${remoteState.title}"`);
    console.log(`  - Status: ${remoteState.status}`);
    console.log(`  - Contributors: ${remoteState.contributors.length}`);
    console.log(`  - Deliverables: ${remoteState.deliverables.length}`);
    console.log(`  - Projects: ${remoteState.projects.length}`);
    console.log(`  - Roadmaps: ${remoteState.roadmaps.length}`);

    // Fetch local document
    const localDoc = await getLocalDocument();
    const localState = localDoc.state.global;
    console.log(`\n✓ Local document fetched: "${localState.title}"`);
    console.log(`  - Status: ${localState.status}`);
    console.log(`  - Contributors: ${localState.contributors.length}`);
    console.log(`  - Deliverables: ${localState.deliverables.length}`);
    console.log(`  - Projects: ${localState.projects.length}`);
    console.log(`  - Roadmaps: ${localState.roadmaps.length}`);

    // Generate actions
    console.log('\nGenerating actions to mirror remote state...');
    const actions = generateActions(remoteState, localState);
    console.log(`✓ Generated ${actions.length} actions`);

    if (actions.length === 0) {
      console.log('\n✓ Documents are already in sync!');
      return;
    }

    // Show action summary
    const actionTypes: Record<string, number> = {};
    actions.forEach(action => {
      actionTypes[action.type] = (actionTypes[action.type] || 0) + 1;
    });
    console.log('\nAction summary:');
    Object.entries(actionTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    // Send actions
    await sendActions(actions);

    // Verify final state
    console.log('\nVerifying final state...');
    const finalLocalDoc = await getLocalDocument();
    const finalLocalState = finalLocalDoc.state.global;
    console.log(`✓ Final local document state:`);
    console.log(`  - Title: "${finalLocalState.title}"`);
    console.log(`  - Status: ${finalLocalState.status}`);
    console.log(`  - Contributors: ${finalLocalState.contributors.length}`);
    console.log(`  - Deliverables: ${finalLocalState.deliverables.length}`);
    console.log(`  - Projects: ${finalLocalState.projects.length}`);
    console.log(`  - Roadmaps: ${finalLocalState.roadmaps.length}`);

    console.log('\n' + '='.repeat(70));
    console.log('✓ Mirror complete!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n✗ Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
