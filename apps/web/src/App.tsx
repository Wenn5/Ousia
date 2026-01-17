import { useState, useRef, useEffect } from "react";
import type { Block } from "@ousia/core";
import {
  createBlock,
  splitBlock,
  mergeBlockWithPrevious,
} from "@ousia/core";

function App() {
  const [blocks, setBlocks] = useState<Block[]>([createBlock("paragraph", "")]);

  // ref 保存每个 block 的 textarea dom，方便 focus
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  // 更新 textareaRefs
  const setRef = (id: string, el: HTMLTextAreaElement | null) => {
    if (el) {
      textareaRefs.current.set(id, el);
    } else {
      textareaRefs.current.delete(id);
    }
  };

  // 通用 change
  const handleChange = (id: string, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, text: value } : b))
    );
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, block: Block) => {
    const textarea = e.currentTarget;
    const cursor = textarea.selectionStart;

    // Enter → split block
    if (e.key === "Enter") {
      e.preventDefault();
      setBlocks((prev) => {
        const newBlocks = splitBlock(prev, block.id, cursor);

        // 聚焦新 block
        setTimeout(() => {
          const index = newBlocks.findIndex((b) => b.id === block.id);
          const newBlock = newBlocks[index + 1];
          const el = textareaRefs.current.get(newBlock.id);
          if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = 0;
          }
        }, 0);

        return newBlocks;
      });
    }

    // Backspace at start → merge with previous
    if (e.key === "Backspace" && cursor === 0) {
      e.preventDefault();
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === block.id);
        if (index === 0) return prev; // 已经是第一个 block

        const newBlocks = mergeBlockWithPrevious(prev, block.id);

        // 聚焦合并后的 block
        setTimeout(() => {
          const mergedBlock = newBlocks[index - 1];
          const el = textareaRefs.current.get(mergedBlock.id);
          if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = mergedBlock.text.length;
          }
        }, 0);

        return newBlocks;
      });
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      {blocks.map((block) => (
        <textarea
          key={block.id}
          ref={(el) => setRef(block.id, el)}
          value={block.text}
          onChange={(e) => handleChange(block.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, block)}
          style={{
            width: "100%",
            minHeight: 30,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 8,
            padding: 8,
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
}

export default App;
