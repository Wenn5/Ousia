import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './TipTapEditor.css';

/**
 * Button component for the editor toolbar
 */
const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title
}: {
  onClick: () => void,
  isActive?: boolean,
  disabled?: boolean,
  children: React.ReactNode,
  title?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      px-2 py-1 min-w-[28px] h-[28px] rounded text-sm font-medium transition-colors flex items-center justify-center
      ${isActive
        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
        : 'hover:bg-gray-200 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
      }
      ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
    `}
  >
    {children}
  </button>
);

/**
 * Divider for toolbar groups
 */
const ToolbarDivider = () => (
  <div className="w-px h-5 bg-gray-300 mx-1 self-center dark:bg-gray-700" />
);

/**
 * Toolbar component containing formatting actions
 */
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-4 border-b border-gray-200 dark:border-gray-800 sticky top-[-1rem] -mx-4 px-4 bg-white/95 backdrop-blur z-10 dark:bg-gray-950/95 pt-0">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strike"
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Code"
      >
        &lt;&gt;
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        title="Paragraph"
      >
        P
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        ""
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        —
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
      >
        ↩️
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        ↪️
      </ToolbarButton>
    </div>
  );
};

/**
 * Compact TipTap editor component for note-taking
 */
export function TipTapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h1>Welcome to Ousia</h1><p>Start writing your notes here...</p><p>You can use the toolbar above to format your text.</p>',
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[50vh] focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container relative">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
