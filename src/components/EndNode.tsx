import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedNode } from '../store/workflowSlice';

interface EndNodeProps extends NodeProps {
  data: WorkflowNodeData;
}

const EndNode: React.FC<EndNodeProps> = ({ id, data, selected }) => {
  const dispatch = useAppDispatch();
  const { ui } = useAppSelector((state) => state.workflow);

  const handleClick = () => {
    dispatch(setSelectedNode(id));
  };

  const isSelected = selected || ui.selectedNodeId === id;

  return (
    <div
      onClick={handleClick}
      className={`
        relative bg-white rounded-full shadow-lg border-2 transition-all duration-200 cursor-pointer
        w-16 h-16 flex items-center justify-center
        ${isSelected ? 'border-primary-500 shadow-xl' : 'border-gray-300 hover:border-gray-400'}
        ${data.hasError ? 'border-red-500 bg-red-50' : ''}
      `}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !border-2 !border-white"
        style={{ top: -5, width: 10, height: 10 }}
      />

      {/* End label */}
      <span className="text-sm font-medium text-gray-700">
        End
      </span>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 bg-primary-500/20 rounded-full pointer-events-none" />
      )}
    </div>
  );
};

export default EndNode;
