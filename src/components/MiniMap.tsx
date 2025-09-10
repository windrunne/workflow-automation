import React from 'react';
import { MiniMap as ReactFlowMiniMap } from 'reactflow';
import type { MiniMapProps } from 'reactflow';

const MiniMap: React.FC<MiniMapProps> = (props) => {
  return (
    <ReactFlowMiniMap
      {...props}
      nodeColor={(node) => {
        if (node.data?.type === 'source') return 'rgba(34, 197, 94, 0.3)';
        if (node.data?.type === 'processing') return 'rgba(59, 130, 246, 0.3)';
        if (node.data?.type === 'decision') return 'rgba(234, 179, 8, 0.3)';
        if (node.data?.type === 'output') return 'rgba(168, 85, 247, 0.3)';
        return '#f3f4f6';
      }}
      nodeBorderRadius={8}
    />
  );
};

export default MiniMap;
