import * as React from 'react';
import {
  Panel,
  Group,
  Separator,
  PanelImperativeHandle,
  useDefaultLayout,
  PanelSize,
} from 'react-resizable-panels';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
} from '@dnd-kit/core';

// Storage key for WidgetArea width persistence
const WIDGET_AREA_WIDTH_KEY = 'ousia-widget-area-width';
const WIDGET_AREA_MODE_KEY = 'ousia-widget-area-mode';
const WIDGET_AREA_POSITION_KEY = 'ousia-widget-area-position';

/**
 * Context for layout mode detection
 */
const LayoutModeContext = React.createContext<{
  mode: 'resizable' | 'standard';
}>({ mode: 'standard' });

/**
 * Main layout container for the note app
 * Structure: ShortcutBar | DocumentTree | MainArea(Editor + RightPanel)
 *
 * @param resizable - Enable react-resizable-panels for resizable layout
 */
export const AppLayout: React.FC<{
  children: React.ReactNode;
  resizable?: boolean;
}> = ({ children, resizable = false }) => {
  if (resizable) {
    // In resizable mode, children should contain Panel components
    return (
      <LayoutModeContext.Provider value={{ mode: 'resizable' }}>
        <Group orientation="horizontal" className="h-screen w-screen overflow-hidden">
          {children}
        </Group>
      </LayoutModeContext.Provider>
    );
  }

  return (
    <LayoutModeContext.Provider value={{ mode: 'standard' }}>
      <div className="h-screen w-screen overflow-hidden flex">
        {children}
      </div>
    </LayoutModeContext.Provider>
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
 * Type for widget area mode
 */
export type WidgetAreaMode = 'floating' | 'fixed';

/**
 * Type for widget area position (for floating mode)
 */
interface WidgetAreaPosition {
  x: number;
  y: number;
}

/**
 * Internal hook to load widget area settings from localStorage
 */
function useWidgetAreaSettings() {
  const [width, setWidth] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem(WIDGET_AREA_WIDTH_KEY);
      return saved ? parseFloat(saved) : 250;
    } catch {
      return 250;
    }
  });

  const [mode, setMode] = React.useState<WidgetAreaMode>(() => {
    try {
      const saved = localStorage.getItem(WIDGET_AREA_MODE_KEY);
      return (saved === 'floating' || saved === 'fixed') ? saved : 'fixed';
    } catch {
      return 'fixed';
    }
  });

  const [position, setPosition] = React.useState<WidgetAreaPosition>(() => {
    try {
      const saved = localStorage.getItem(WIDGET_AREA_POSITION_KEY);
      return saved ? JSON.parse(saved) : { x: 60, y: 0 };
    } catch {
      return { x: 60, y: 0 };
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(WIDGET_AREA_WIDTH_KEY, width.toString());
    } catch {
      // Ignore storage errors
    }
  }, [width]);

  React.useEffect(() => {
    try {
      localStorage.setItem(WIDGET_AREA_MODE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
  }, [mode]);

  React.useEffect(() => {
    try {
      localStorage.setItem(WIDGET_AREA_POSITION_KEY, JSON.stringify(position));
    } catch {
      // Ignore storage errors
    }
  }, [position]);

  return { width, setWidth, mode, setMode, position, setPosition };
}

/**
 * Draggable handle component for floating mode
 */
const DragHandle: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'widget-area-drag-handle',
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing select-none"
    >
      {children}
    </div>
  );
};

/**
 * Resize handle component for fixed mode
 */
const ResizeHandleInner = () => (
  <div className="w-1 hover:w-2 transition-all bg-transparent hover:bg-blue-500 cursor-col-resize group relative">
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-0.5 h-8 bg-blue-500 rounded-full" />
    </div>
  </div>
);

/**
 * Widget area with resizable and floating support
 *
 * @param mode - 'fixed' mode is embedded in layout, 'floating' mode floats above editor
 * @param defaultWidth - Initial width in pixels (default: 250)
 * @param minWidth - Minimum width in pixels (default: 180)
 * @param maxWidth - Maximum width in pixels (default: 500)
 * @param resizable - Enable width resizing (default: true)
 * @param onWidthChange - Callback when width changes
 * @param onModeChange - Callback when mode changes
 */
export const WidgetArea: React.FC<{
  children?: React.ReactNode;
  mode?: WidgetAreaMode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  onWidthChange?: (size: number) => void;
  onModeChange?: (mode: WidgetAreaMode) => void;
}> = ({
  children,
  mode: propMode,
  defaultWidth = 250,
  minWidth = 180,
  maxWidth = 500,
  resizable = true,
  onWidthChange,
  onModeChange,
}) => {
  const contextMode = React.useContext(LayoutModeContext);
  const settings = useWidgetAreaSettings();
  const [localWidth, setLocalWidth] = React.useState(defaultWidth);
  const panelRef = React.useRef<PanelImperativeHandle>(null);
  const [isResizing, setIsResizing] = React.useState(false);

  // Use prop mode if provided, otherwise use saved mode
  const mode = propMode ?? settings.mode;

  // Use saved width if no prop provided
  const effectiveWidth = propMode ? localWidth : settings.width;

  // Calculate percentage for react-resizable-panels
  // Assuming viewport width of roughly 1920px for default calculation
  const defaultSizePercent = (effectiveWidth / window.innerWidth) * 100;
  const minSizePercent = (minWidth / window.innerWidth) * 100;
  const maxSizePercent = (maxWidth / window.innerWidth) * 100;

  const handleWidthChange = React.useCallback(
    (panelSize: PanelSize) => {
      // PanelSize contains both inPixels and asPercentage
      const pixelWidth = panelSize.inPixels;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, Math.round(pixelWidth)));

      if (!propMode) {
        settings.setWidth(clampedWidth);
      } else {
        setLocalWidth(clampedWidth);
      }

      onWidthChange?.(clampedWidth);
    },
    [minWidth, maxWidth, onWidthChange, propMode, settings]
  );

  // Helper function for direct pixel width changes (used by custom resize handle)
  const handlePixelWidthChange = React.useCallback(
    (pixelWidth: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, pixelWidth));

      if (!propMode) {
        settings.setWidth(clampedWidth);
      } else {
        setLocalWidth(clampedWidth);
      }

      onWidthChange?.(clampedWidth);
    },
    [minWidth, maxWidth, onWidthChange, propMode, settings]
  );

  const handleModeToggle = () => {
    const newMode: WidgetAreaMode = mode === 'fixed' ? 'floating' : 'fixed';
    if (!propMode) {
      settings.setMode(newMode);
    }
    onModeChange?.(newMode);
  };

  const handleDrag = React.useCallback(
    (delta: { x: number; y: number }) => {
      if (mode === 'floating') {
        settings.setPosition({
          x: settings.position.x + delta.x,
          y: settings.position.y + delta.y,
        });
      }
    },
    [mode, settings]
  );

  // Floating mode implementation
  if (mode === 'floating') {
    return (
      <DndContext onDragEnd={(event: DragEndEvent) => {
        handleDrag({ x: event.delta.x, y: event.delta.y });
      }}>
        <div
          className="absolute z-10 top-0 bottom-0 bg-gray-50/95 backdrop-blur-sm border-r border-gray-300 overflow-y-auto p-3 dark:bg-gray-800/95 dark:border-gray-700 shadow-xl"
          style={{
            left: `${settings.position.x}px`,
            width: `${effectiveWidth}px`,
          }}
        >
          {/* Header with drag handle and controls */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <DragHandle>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                Widget Panel
              </div>
            </DragHandle>
            <button
              onClick={handleModeToggle}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Switch to fixed mode"
            >
              Fixed
            </button>
          </div>

          {/* Content */}
          {children || (
            <div className="text-gray-500 dark:text-gray-400">
              Document Tree Placeholder
            </div>
          )}
        </div>
      </DndContext>
    );
  }

  // Fixed mode implementation
  if (contextMode.mode === 'resizable' && resizable) {
    // Use react-resizable-panels Panel
    return (
      <div className="relative flex">
        <Panel
          panelRef={panelRef}
          defaultSize={defaultSizePercent}
          minSize={minSizePercent}
          maxSize={maxSizePercent}
          onResize={handleWidthChange}
          className="bg-gray-50 border-r border-gray-300 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
          id="widget-area-panel"
        >
          <div className="p-3">
            {/* Mode toggle button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleModeToggle}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Switch to floating mode"
              >
                Floating
              </button>
            </div>
            {children || (
              <div className="text-gray-500 dark:text-gray-400">
                Document Tree Placeholder
              </div>
            )}
          </div>
        </Panel>
        <Separator className="bg-gray-300 dark:bg-gray-700 hover:bg-blue-500 transition-colors" />
      </div>
    );
  }

  // Standard fixed mode without resizable panels
  return (
    <div className="relative group">
      <div
        className="bg-gray-50 border-r border-gray-300 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
        style={{ width: `${effectiveWidth}px` }}
      >
        <div className="p-3">
          {/* Mode toggle button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={handleModeToggle}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Switch to floating mode"
            >
              Floating
            </button>
          </div>
          {children || (
            <div className="text-gray-500 dark:text-gray-400">
              Document Tree Placeholder
            </div>
          )}
        </div>
      </div>
      {/* Custom resize handle */}
      {resizable && (
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 hover:w-2 transition-all bg-transparent hover:bg-blue-500 cursor-col-resize ${
            isResizing ? 'w-2 bg-blue-500' : ''
          }`}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = effectiveWidth;

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth + (e.clientX - startX);
              handlePixelWidthChange(newWidth);
            };

            const handleMouseUp = () => {
              setIsResizing(false);
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            setIsResizing(true);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
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
