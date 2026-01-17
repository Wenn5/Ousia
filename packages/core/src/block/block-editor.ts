import { Block } from "./block";

/**
 * Split a block into two blocks at the given position.
 * Used for "Enter" key behavior.
 */
export function splitBlock(
  blocks: Block[],
  blockId: string,
  position: number
): Block[] {
  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return blocks;

  const block = blocks[index];

  const beforeText = block.text.slice(0, position);
  const afterText = block.text.slice(position);

  const firstBlock: Block = {
    ...block,
    text: beforeText,
  };

  const secondBlock: Block = {
    id: crypto.randomUUID(),
    type: block.type,
    text: afterText,
  };

  return [
    ...blocks.slice(0, index),
    firstBlock,
    secondBlock,
    ...blocks.slice(index + 1),
  ];
}

/**
 * Merge current block with the previous block.
 * Used for "Backspace at beginning of block".
 */
export function mergeBlockWithPrevious(
  blocks: Block[],
  blockId: string
): Block[] {
  const index = blocks.findIndex((b) => b.id === blockId);
  if (index <= 0) return blocks;

  const current = blocks[index];
  const previous = blocks[index - 1];

  const mergedBlock: Block = {
    ...previous,
    text: previous.text + current.text,
  };

  return [
    ...blocks.slice(0, index - 1),
    mergedBlock,
    ...blocks.slice(index + 1),
  ];
}
