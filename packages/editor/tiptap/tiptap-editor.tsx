import React from 'react';
import {useEditor, EditorContent, EditorContext} from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';

export const TipTapEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World! This is TipTap editor.</p>',
    });

    const providerValue = React.useMemo(() => ({ editor }), [editor]);

    return (
        <EditorContext.Provider value={providerValue}>
        <EditorContent editor={editor} />
        <FloatingMenu editor = {editor}>Floating menu</FloatingMenu>
        <BubbleMenu editor = {editor}>Bubble menu</BubbleMenu>
        </EditorContext.Provider>
    );
};