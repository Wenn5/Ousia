import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import type { Block } from '@ousia/core';
import { blockParser } from '@ousia/core';
import { DebugPanel } from './DebugPanel';

import './TipTapEditor.css';

export function TipTapEditor() {
  // 状态管理
  const [tipTapJSON, setTipTapJSON] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  // 初始化编辑器
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🎉</p><p>Try editing this TipTap editor.</p>',
    onUpdate: ({ editor }) => {
      // 实时获取 TipTap JSON
      const json = editor.getJSON();
      setTipTapJSON(json);

      // 实时转换为 Block 数据
      const newBlocks = blockParser.tiptapToBlocks(json as any, 'doc-1');
      setBlocks(newBlocks);
    },
    onCreate: ({ editor }) => {
      // 初始化时也触发一次
      const json = editor.getJSON();
      setTipTapJSON(json);
      const initialBlocks = blockParser.tiptapToBlocks(json as any, 'doc-1');
      setBlocks(initialBlocks);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="tiptap-editor">
        <div className="editor-header">
          <h1>TipTap Editor + Block Model</h1>
        </div>

        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>

        <div className="editor-footer">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
          >
            Bold
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
          >
            Italic
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
          >
            Strike
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
          >
            Code
          </button>

          <button onClick={() => editor.chain().focus().setParagraph().run()} className="toolbar-button">
            Paragraph
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          >
            H1
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          >
            Bullet List
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          >
            Ordered List
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`toolbar-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          >
            Code Block
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          >
            Blockquote
          </button>

          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="toolbar-button">
            Horizontal Rule
          </button>

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="toolbar-button"
          >
            Undo
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="toolbar-button"
          >
            Redo
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel tipTapJSON={tipTapJSON} blocks={blocks} />
    </>
  );
}
