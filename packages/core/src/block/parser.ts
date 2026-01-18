/**
 * Block ↔ TipTap 转换器
 * 负责在 Block 数据模型和 TipTap JSON 格式之间进行转换
 */

import type { Block, BlockType } from './types';

/**
 * TipTap JSON 格式定义
 */
export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: any[];
}

export interface TipTapJSON {
  type: 'doc';
  content: TipTapNode[];
}

/**
 * BlockParser 类
 */
export class BlockParser {
  /**
   * Block 数组 → TipTap JSON
   * 用于初始化编辑器
   */
  blocksToTipTap(blocks: Block[]): TipTapJSON {
    // 按 position 排序
    const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

    return {
      type: 'doc',
      content: sortedBlocks.map((block) => this.blockToTipTapNode(block)),
    };
  }

  /**
   * TipTap JSON → Block 数组
   * 在编辑器更新时调用
   */
  tiptapToBlocks(tiptapJson: TipTapJSON, nodeId: string = 'default'): Block[] {
    const blocks: Block[] = [];
    let position = 0;

    // 递归遍历 TipTap JSON
    function traverseNode(node: TipTapNode) {
      // 只处理顶级 block 节点
      if (this.isBlockNode(node)) {
        const block = this.tiptapNodeToBlock(node, nodeId, position);
        if (block) {
          blocks.push(block);
          position++;
        }
      }

      // 递归处理子节点
      if (node.content) {
        node.content.forEach((child) => traverseNode.call(this, child));
      }
    }

    if (tiptapJson.type === 'doc' && tiptapJson.content) {
      tiptapJson.content.forEach((node) => traverseNode.call(this, node));
    }

    return blocks;
  }

  /**
   * 判断节点是否是 Block 节点
   */
  private isBlockNode(node: TipTapNode): boolean {
    return ['paragraph', 'heading', 'codeBlock', 'listItem', 'blockquote'].includes(
      node.type
    );
  }

  /**
   * 单个 Block → TipTap Node
   */
  private blockToTipTapNode(block: Block): TipTapNode {
    const baseAttrs = {
      blockId: block.id,
      position: block.position,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
    };

    switch (block.type) {
      case 'paragraph':
        return {
          type: 'paragraph',
          attrs: baseAttrs,
          content: [{ type: 'text', text: block.content }],
        };

      case 'heading':
        return {
          type: 'heading',
          attrs: {
            ...baseAttrs,
            level: block.attrs?.level || 1,
          },
          content: [{ type: 'text', text: block.content }],
        };

      case 'code':
        return {
          type: 'codeBlock',
          attrs: baseAttrs,
          content: [{ type: 'text', text: block.content }],
        };

      case 'list-item':
        return {
          type: 'listItem',
          attrs: baseAttrs,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: block.content }],
            },
          ],
        };

      case 'blockquote':
        return {
          type: 'blockquote',
          attrs: baseAttrs,
          content: [{ type: 'text', text: block.content }],
        };

      default:
        // 默认作为 paragraph
        return {
          type: 'paragraph',
          attrs: baseAttrs,
          content: [{ type: 'text', text: block.content }],
        };
    }
  }

  /**
   * 单个 TipTap Node → Block
   */
  private tiptapNodeToBlock(
    node: TipTapNode,
    nodeId: string,
    position: number
  ): Block | null {
    // 提取文本内容
    const content = this.extractTextContent(node);

    // 获取或生成 Block ID
    const blockId = node.attrs?.blockId || crypto.randomUUID();

    // 映射 TipTap 类型到 Block 类型
    const blockType = this.mapTipTapTypeToBlockType(node.type);
    if (!blockType) {
      return null;
    }

    // 提取属性
    const attrs: Record<string, any> = {};
    if (node.type === 'heading' && node.attrs?.level) {
      attrs.level = node.attrs.level;
    }

    return {
      id: blockId,
      type: blockType,
      content,
      nodeId,
      position,
      createdAt: node.attrs?.createdAt || Date.now(),
      updatedAt: Date.now(),
      attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
    };
  }

  /**
   * 从 TipTap Node 提取纯文本内容
   */
  private extractTextContent(node: TipTapNode): string {
    if (node.text) {
      return node.text;
    }

    if (node.content) {
      return node.content.map((child) => this.extractTextContent(child)).join('');
    }

    return '';
  }

  /**
   * 映射 TipTap 类型到 Block 类型
   */
  private mapTipTapTypeToBlockType(tiptapType: string): BlockType | null {
    const mapping: Record<string, BlockType> = {
      paragraph: 'paragraph',
      heading: 'heading',
      codeBlock: 'code',
      listItem: 'list-item',
      blockquote: 'blockquote',
    };

    return mapping[tiptapType] || null;
  }
}

/**
 * 单例实例
 */
export const blockParser = new BlockParser();
