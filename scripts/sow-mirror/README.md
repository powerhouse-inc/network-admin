# ScopeOfWork Document Mirror Script

Mirrors a ScopeOfWork document from a remote MCP server to a local MCP server.

## Usage

```bash
bun scripts/sow-mirror/mirror_sow_state.ts \
  <remote-mcp-url> \
  <remote-sow-id> \
  <remote-drive-id> \
  <local-mcp-url> \
  <local-sow-id> \
  <local-drive-id>
```

### Example

```bash
bun scripts/sow-mirror/mirror_sow_state.ts \
  https://switchboard-dev.powerhouse.xyz/mcp \
  65f3e7e8-500d-4c42-9e73-8cd5d7966cd8 \
  powerhouse-network-admin \
  http://localhost:4001/mcp \
  c16bec62-9a68-45aa-8d3f-510bb0c57044 \
  bai-network-admin
```

## What It Does

The script:
1. Fetches the complete state of the remote ScopeOfWork document
2. Fetches the current state of the local ScopeOfWork document
3. Compares both states and identifies what's missing locally
4. Generates MCP actions to sync the local document with the remote one
5. Executes actions in batches of 50 for reliability
6. Verifies the final state

## What Gets Synced

- Document metadata (title, description, status)
- Contributors
- Deliverables with key results and progress
- Budget anchors
- Projects with deliverables and scope metadata
- Roadmaps with milestones
- Coordinators

## Features

- **Incremental sync**: Only creates actions for missing entities
- **Safe re-runs**: Running multiple times won't create duplicates
- **Batch processing**: Sends 50 actions per batch to avoid timeouts
- **Error handling**: Reports failures with detailed messages

## Output

The script provides detailed progress:

```
======================================================================
Scope of Work Document Mirror Script
======================================================================

Configuration:
  Remote MCP: https://switchboard-dev.powerhouse.xyz/mcp
  ...

✓ Remote document fetched: "Scope of Work Powerhouse 2024"
  - Contributors: 2
  - Deliverables: 58
  - Projects: 10
  - Roadmaps: 2

✓ Local document fetched: "SOW-Local"
  - Contributors: 0
  - Deliverables: 0
  ...

Generating actions to mirror remote state...
✓ Generated 432 actions

Sending 432 actions in 9 batches...
Batch 1/9 (50 actions)...
✓ Batch 1 completed successfully
...

✓ Final local document state:
  - Contributors: 2
  - Deliverables: 58
  - Projects: 10
  - Roadmaps: 2

======================================================================
✓ Mirror complete!
======================================================================
```

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- Access to both remote and local MCP servers
- Valid document IDs and drive IDs

## Notes

- The script handles SSE (Server-Sent Events) format from MCP servers
- If documents are already in sync, it will report this and skip action execution
- Re-running is safe - only new changes will be applied
