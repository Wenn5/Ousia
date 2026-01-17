/**
 * All supported block types in Ousia.
 *
 * This is intentionally kept minimal for MVP.
 * New block types can be added without breaking existing data.
 */
export type BlockType =
  | "paragraph"
  | "heading"
  | "list-item"
  | "code";
