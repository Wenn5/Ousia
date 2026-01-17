import { Block } from "./block";
import { BlockType } from "./block-types";

/**
 * Create a new block with minimal required fields.
 */
export function createBlock(
  type: BlockType = "paragraph",
  text: string = ""
): Block {
  return {
    id: crypto.randomUUID(),
    type,
    text,
  };
}

/**
 * Insert a block after the given block id.
 * Returns a new blocks array.
 */
export function insertBlockAfter(
  blocks: Block[],
  targetBlockId: string,
  newBlock: Block
): Block[] {
  const index = blocks.findIndex((b) => b.id === targetBlockId);

  if (index === -1) {
    // target not found, append to end
    return [...blocks, newBlock];
  }

  return [
    ...blocks.slice(0, index + 1),
    newBlock,
    ...blocks.slice(index + 1),
  ];
}

/**
 * Update text content of a block.
 */
export function updateBlockText(
  blocks: Block[],
  blockId: string,
  newText: string
): Block[] {
  return blocks.map((block) =>
    block.id === blockId
      ? { ...block, text: newText }
      : block
  );
}

/**
 * Remove a block by id.
 */
export function removeBlock(
  blocks: Block[],
  blockId: string
): Block[] {
  return blocks.filter((block) => block.id !== blockId);
}
