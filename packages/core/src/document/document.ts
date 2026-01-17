import { Block } from '../block/block';

export class Document {
  private blocks: Block[] = [];

  addBlock(block: Block) {
    this.blocks.push(block);
  }

  getBlocks(): readonly Block[] {
    return this.blocks;
  }
}
