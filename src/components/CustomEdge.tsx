import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  Position,
} from 'reactflow';

interface CustomEdgeData {
  label?: string;
  number?: string | number;
  isClassification?: boolean;
  labelStyle?: React.CSSProperties;
  labelBgStyle?: React.CSSProperties;
}

interface CustomEdgeProps extends EdgeProps {
  data?: CustomEdgeData;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Right,
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Left,
  });

  const defaultStyle = {
    strokeWidth: 2,
    stroke: selected ? '#3b82f6' : '#6b7280',
    strokeDasharray: data?.label?.includes('Error') ? '5,5' : 'none',
    ...style,
  };

  const defaultLabelStyle = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#374151',
    backgroundColor: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    ...data?.labelStyle,
  };

  const numberStyle = {
    fontSize: '10px',
    fontWeight: 700,
    color: '#ffffff',
    backgroundColor: selected ? '#3b82f6' : '#6b7280',
    padding: '2px 6px',
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        style={defaultStyle}
      />
      

      <EdgeLabelRenderer>
        {/* Number inside edge */}
        {data?.number && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 15}px)`,
              pointerEvents: 'all',
              ...numberStyle,
            }}
            className="nodrag nopan edge-number"
          >
            {data.number}
          </div>
        )}

        {/* Text label for classification edges */}
        {data?.label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + (data.number ? 15 : 0)}px)`,
              pointerEvents: 'all',
              ...defaultLabelStyle,
              ...(data.isClassification && {
                backgroundColor: '#f3f4f6',
                border: '1px solid #9ca3af',
                fontWeight: 500,
                fontSize: '10px',
                maxWidth: '120px',
                textAlign: 'center' as const,
                lineHeight: '1.2',
              }),
            }}
            className="nodrag nopan edge-label"
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
