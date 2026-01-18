/**
 * Block 数据类型定义
 * Ousia 的核心数据模型
 */

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'list-item'
  | 'code'
  | 'blockquote';

export interface Block {
  /** 唯一 ID (UUID) */
  id: string;

  /** Block 类型 */
  type: BlockType;

  /** 文本内容 (纯文本，不包含格式) */
  content: string;

  /** 所属文档 ID */
  nodeId: string;

  /** 在文档中的位置 (0, 1, 2, ...) */
  position: number;

  /** 创建时间戳 */
  createdAt: number;

  /** 更新时间戳 */
  updatedAt: number;

  /** 扩展属性 (如 heading level) */
  attrs?: BlockAttrs;
}

export interface BlockAttrs {
  /** 标题级别 (仅 heading 类型) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /** 列表类型 (仅 list-item 类型) */
  listType?: 'bullet' | 'ordered';

  /** 自定义属性 */
  [key: string]: any;
}

/**
 * 创建一个新的 Block
 */
export function createBlock(
  type: BlockType,
  content: string,
  options: Partial<Omit<Block, 'id' | 'type' | 'content' | 'createdAt' | 'updatedAt'>> = {}
): Block {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    nodeId: options.nodeId || 'default',
    position: options.position || 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    attrs: options.attrs || {},
  };
}

/**
 * Block 操作：更新内容
 */
export function updateBlockContent(block: Block, newContent: string): Block {
  return {
    ...block,
    content: newContent,
    updatedAt: Date.now(),
  };
}

/**
 * Block 操作：更新位置
 */
export function updateBlockPosition(block: Block, newPosition: number): Block {
  return {
    ...block,
    position: newPosition,
    updatedAt: Date.now(),
  };
}
