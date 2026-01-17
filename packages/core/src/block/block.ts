import { BlockType } from "./block-types";

/**
 * The minimal block unit in Ousia.
 *
 * Block is a pure data structure:
 * - Serializable
 * - UI-agnostic
 * - Platform-agnostic
 */
export interface Block {
  /**
   * Globally unique identifier.
   * Should be stable across edits and sync.
   */
  id: string;

  /**
   * Block semantic type.
   */
  type: BlockType;

  /**
   * Main textual content of the block.
   * For MVP, all blocks are text-based.
   */
  text: string;
}
