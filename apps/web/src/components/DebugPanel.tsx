import type { Block } from '@ousia/core';
import type { TipTapJSON } from '@ousia/core';

interface DebugPanelProps {
  tipTapJSON: TipTapJSON | null;
  blocks: Block[];
}

export function DebugPanel({ tipTapJSON, blocks }: DebugPanelProps) {
  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h2>Debug Panel</h2>
      </div>

      <div className="debug-content">
        {/* 左列：TipTap JSON */}
        <div className="debug-column">
          <h3>TipTap JSON</h3>
          <pre className="json-display">
            {tipTapJSON ? JSON.stringify(tipTapJSON, null, 2) : '// No data'}
          </pre>
        </div>

        {/* 右列：Block 数据 */}
        <div className="debug-column">
          <h3>Block Data</h3>
          <pre className="json-display">
            {blocks.length > 0 ? JSON.stringify(blocks, null, 2) : '// No blocks'}
          </pre>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="debug-stats">
        <div className="stat-item">
          <span className="stat-label">Blocks:</span>
          <span className="stat-value">{blocks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Characters:</span>
          <span className="stat-value">
            {blocks.reduce((sum, b) => sum + b.content.length, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
