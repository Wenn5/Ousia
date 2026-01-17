# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ousia is an AI-native personal knowledge base built as a monorepo using pnpm workspaces. It is designed to be more than a note-taking app - a "Second Brain" and persistent virtual manifestation of intellect.

## Monorepo Structure

- **`packages/core`** - Core logic package (`@ousia/core`)
  - Pure data structures and business logic
  - Block-based document model (similar to Notion/BlockSuite)
  - UI-agnostic, platform-agnostic, serializable
  - Main entry: `src/index.ts`

- **`apps/web`** - React web application
  - Vite + React 19 + TypeScript
  - Consumes `@ousia/core` via workspace protocol
  - Dev server, building, preview

## Common Commands

All commands use pnpm (version 10.28.0):

```bash
# Install dependencies
pnpm install

# Run dev server (apps/web)
cd apps/web && pnpm dev

# Build the web app
cd apps/web && pnpm build

# Preview production build
cd apps/web && pnpm preview

# Lint the web app
cd apps/web && pnpm lint
```

## Architecture

### Block Model (`packages/core/src/block/`)

The core abstraction is the **Block** - a minimal, serializable unit:

```typescript
interface Block {
  id: string;        // Globally unique, stable (uses crypto.randomUUID())
  type: BlockType;   // "paragraph" | "heading" | "list-item" | "code"
  text: string;      // Text content (MVP: all blocks are text-based)
}
```

Key design principles:
- **Pure data** - No UI coupling, can serialize/deserialize
- **Immutable operations** - Functions return new arrays rather than mutating
- **Stable IDs** - IDs persist across edits/sync (not array indices)

### Block Operations (`packages/core/src/block/block-operations.ts`)

All block operations are pure functions that return new block arrays:

- `createBlock(type, text)` - Create a new block
- `insertBlockAfter(blocks, targetBlockId, newBlock)` - Insert after target
- `updateBlockText(blocks, blockId, newText)` - Update content
- `removeBlock(blocks, blockId)` - Remove by ID
- `splitBlock(blocks, blockId, cursor)` - Split at cursor position
- `mergeBlockWithPrevious(blocks, blockId)` - Merge with previous block

Note: Some operations like `splitBlock` and `mergeBlockWithPrevious` are referenced in the web app but may not be fully implemented yet.

### Document Model (`packages/core/src/document/`)

`Document` class wraps a collection of blocks:
- `addBlock(block)` - Append block
- `getBlocks()` - Get readonly block array

Currently commented out in the core exports while the block system is being developed.

### Web App Integration (`apps/web/src/App.tsx`)

The React app demonstrates block editor usage:
- State management with `useState<Block[]>`
- Textarea-based editing (one textarea per block)
- Keyboard shortcuts:
  - `Enter` → split block at cursor
  - `Backspace` at start → merge with previous block

## TypeScript Configuration

- **Core package**: ES2020 target, ESNext modules, bundler resolution
- **Web app**: Project references (tsconfig.app.json, tsconfig.node.json)
- Both use `strict: true`

## Workspace Dependencies

The web app imports core using the workspace protocol:
```json
{
  "dependencies": {
    "@ousia/core": "workspace:*"
  }
}
```

pnpm automatically resolves this to the local package during development.

## Development Notes

- React Compiler is not enabled (see apps/web/README.md for instructions to enable)
- ESLint uses the new flat config format (`eslint.config.js`)
- Vite 7.x with `@vitejs/plugin-react` for Fast Refresh
- All core functions are pure - avoid mutating state directly
- When adding new block types, update `BlockType` in `packages/core/src/block/block-types.ts`
