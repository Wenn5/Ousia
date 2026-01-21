import { useState } from 'react';
import {
  AppLayout,
  ShortcutBar,
  DocumentTree,
  MainArea,
  EditorArea,
  RightPanel,
  TabBar,
  TabItem,
  ShortcutButton
} from '@ousia/web/layout';
import { TipTapEditor } from '@ousia/editor';
//import { TestTailwind } from './test-tailwind';

function App() {
  // Tab state for editor area
  const [editorTab, setEditorTab] = useState<'editor' | 'preview'>('editor');
  // Tab state for right panel
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'outline'>('properties');

  return (
    <>
      {/* Test Tailwind */}
      {/*<TestTailwind />*/}

      <AppLayout>
      {/* Left shortcut bar with action buttons */}
      <ShortcutBar
        settingsButton={
          <ShortcutButton tooltip="Settings">
            <span className="text-xl">⚙️</span>
          </ShortcutButton>
        }
      >
        <ShortcutButton tooltip="New Note">
          <span className="text-xl">📝</span>
        </ShortcutButton>
        <ShortcutButton tooltip="Search">
          <span className="text-xl">🔍</span>
        </ShortcutButton>
        <ShortcutButton tooltip="Favorites">
          <span className="text-xl">⭐</span>
        </ShortcutButton>
        <ShortcutButton tooltip="Recent">
          <span className="text-xl">🕐</span>
        </ShortcutButton>
      </ShortcutBar>

      {/* Document tree panel */}
      <DocumentTree />

      {/* Main content area with editor and right panel */}
      <MainArea
        tabs={
          <TabBar>
            <TabItem
              active={editorTab === 'editor'}
              onClick={() => setEditorTab('editor')}
            >
              Editor
            </TabItem>
            <TabItem
              active={editorTab === 'preview'}
              onClick={() => setEditorTab('preview')}
            >
              Preview
            </TabItem>
          </TabBar>
        }
      >
        {/* Editor panel */}
        {editorTab === 'editor' && (
          <EditorArea>
            <TipTapEditor />
          </EditorArea>
        )}

        {/* Preview placeholder */}
        {editorTab === 'preview' && (
          <EditorArea>
            <div className="text-gray-500 text-center mt-10">
              Preview Mode
            </div>
          </EditorArea>
        )}

        {/* Right panel with tabs */}
        <RightPanel>
          <div className="mb-4">
            <TabBar>
              <TabItem
                active={rightPanelTab === 'properties'}
                onClick={() => setRightPanelTab('properties')}
              >
                Properties
              </TabItem>
              <TabItem
                active={rightPanelTab === 'outline'}
                onClick={() => setRightPanelTab('outline')}
              >
                Outline
              </TabItem>
            </TabBar>
          </div>

          {rightPanelTab === 'properties' && (
            <div className="text-gray-500 text-sm">
              <p className="mt-0">Document properties will appear here.</p>
            </div>
          )}

          {rightPanelTab === 'outline' && (
            <div className="text-gray-500 text-sm">
              <p className="mt-0">Document outline will appear here.</p>
            </div>
          )}
        </RightPanel>
      </MainArea>
    </AppLayout>
    </>
  );
}

export default App;
