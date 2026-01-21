import * as React from 'react';

/**
 * Main layout container for the note app
 * Structure: ShortcutBar | DocumentTree | MainArea(Editor + RightPanel)
 */
export const AppLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {children}
    </div>
  );
};

/**
 * Left shortcut bar with action buttons
 * Settings button positioned at bottom left
 */
export const ShortcutBar: React.FC<{
  children: React.ReactNode;
  settingsButton?: React.ReactNode;
}> = ({ children, settingsButton }) => {
  return (
    <div className="flex flex-col justify-between w-[60px] bg-gray-100 border-r border-gray-300 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col gap-2 p-2">
        {children}
      </div>
      {settingsButton && (
        <div className="p-2">
          {settingsButton}
        </div>
      )}
    </div>
  );
};

/**
 * Document tree panel (placeholder for file navigator)
 */
export const DocumentTree: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="w-[250px] bg-gray-50 border-r border-gray-300 overflow-y-auto p-3 dark:bg-gray-800 dark:border-gray-700">
      {children || (
        <div className="text-gray-500 dark:text-gray-400">
          Document Tree Placeholder
        </div>
      )}
    </div>
  );
};

/**
 * Main content area containing tab bar and panels
 * Includes EditorArea and RightPanel
 */
export const MainArea: React.FC<{
  tabs?: React.ReactNode;
  children: React.ReactNode;
}> = ({ tabs, children }) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar (optional) */}
      {tabs && (
        <div className="bg-white border-b border-gray-300 p-2 dark:bg-gray-900 dark:border-gray-700">
          {tabs}
        </div>
      )}

      {/* Content area with editor and right panel */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

/**
 * Editor panel for content editing
 */
export const EditorArea: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 dark:bg-gray-950">
      {children}
    </div>
  );
};

/**
 * Right panel (placeholder for details/properties)
 */
export const RightPanel: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="w-[300px] bg-gray-50 border-l border-gray-300 overflow-y-auto p-3 dark:bg-gray-800 dark:border-gray-700">
      {children || (
        <div className="text-gray-500 dark:text-gray-400">
          Right Panel Placeholder
        </div>
      )}
    </div>
  );
};

/**
 * Tab bar container component
 */
export const TabBar: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex gap-2 items-center">
      {children}
    </div>
  );
};

/**
 * Individual tab item with hover and active states
 */
export const TabItem: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ active = false, onClick, children }) => {
  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-1.5 cursor-pointer rounded text-sm font-medium
        transition-colors duration-150 select-none
        ${active
          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 font-semibold'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }
      `}
    >
      {children}
    </div>
  );
};

/**
 * Shortcut bar button component with hover effects
 */
export const ShortcutButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  tooltip?: string;
}> = ({ onClick, children, tooltip }) => {
  return (
    <div
      onClick={onClick}
      className="w-11 h-11 flex items-center justify-center cursor-pointer rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-150 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      title={tooltip}
    >
      {children}
    </div>
  );
};
