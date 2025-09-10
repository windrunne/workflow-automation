import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { WorkflowStepType } from '../types/workflow';
import type { WorkflowNodeData } from '../types/workflow';
import { AVAILABLE_STEPS } from '../constants/workflowSteps';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedNode } from '../store/workflowSlice';
import { SettingsIcon } from 'lucide-react';

interface CustomNodeProps extends NodeProps {
  data: WorkflowNodeData;
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  const dispatch = useAppDispatch();
  const { ui } = useAppSelector((state) => state.workflow);

  const stepMetadata = AVAILABLE_STEPS.find(
    step => step.type === data.type && step.subtype === (data.config as any).subtype
  );

  const handleClick = () => {
    dispatch(setSelectedNode(id));
  };

  const getNodeColor = () => {
    switch (data.type) {
      case WorkflowStepType.SOURCE:
        return 'bg-green-500';
      case WorkflowStepType.PROCESSING:
        return 'bg-blue-500';
      case WorkflowStepType.DECISION:
        return 'bg-yellow-500';
      case WorkflowStepType.OUTPUT:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const hasError = data.hasError;
  const isConfigured = data.isConfigured;
  const isSelected = selected || ui.selectedNodeId === id;

  return (
    <div
      onClick={handleClick}
      className={`
        relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-pointer
        min-w-[200px] max-w-[250px]
        ${isSelected ? 'border-primary-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'}
        ${hasError ? 'border-red-500 bg-red-50' : ''}
      `}
    >
      {/* Header with type indicator */}
      <div className={`${getNodeColor()} p-3 rounded-t-lg`}>
        <div className="flex items-center space-x-2">
          {stepMetadata?.icon ? (
            <stepMetadata.icon className="w-5 h-5 text-white" />
          ) : (
            <SettingsIcon className="w-5 h-5 text-white" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {data.config.name}
            </h3>
            <p className="text-white/80 text-xs truncate">
              {stepMetadata?.label || data.type}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {data.config.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {data.config.description}
          </p>
        )}

        {/* Status indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Configuration status */}
            <div className={`
              w-2 h-2 rounded-full
              ${isConfigured ? 'bg-green-400' : 'bg-yellow-400'}
            `} />
            <span className="text-xs text-gray-500">
              {isConfigured ? 'Configured' : 'Needs Setup'}
            </span>
          </div>

          {/* Enabled/Disabled indicator */}
          {!data.config.enabled && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-400">Disabled</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && data.errorMessage && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
            {data.errorMessage}
          </div>
        )}
      </div>

      {/* Connection Handles */}
      {/* Input handle (except for source nodes) */}
      {data.type !== WorkflowStepType.SOURCE && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
          style={{ left: -6 }}
        />
      )}

      {/* Output handle (except for output nodes) */}
      {data.type !== WorkflowStepType.OUTPUT && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-primary-500 !border-2 !border-white"
          style={{ right: -6 }}
        />
      )}

      {/* Multiple output handles for decision nodes */}
      {data.type === WorkflowStepType.DECISION && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-3 h-3 !bg-green-500 !border-2 !border-white"
            style={{ bottom: -6, left: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-3 h-3 !bg-red-500 !border-2 !border-white"
            style={{ bottom: -6, right: '30%' }}
          />
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 bg-primary-500/20 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export default CustomNode;
