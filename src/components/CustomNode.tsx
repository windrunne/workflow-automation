import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { SettingsIcon } from 'lucide-react';

import { WorkflowStepType, IntegrationStepSubtype } from '../types/workflow';
import type { WorkflowNodeData } from '../types/workflow';
import { AVAILABLE_STEPS } from '../constants/workflowSteps';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedNode } from '../store/workflowSlice';
import { getConfigSubtype, getSelectedApiMethods, isIntegrationStepConfig } from '../utils/typeHelpers';
import EndNode from './EndNode';
import { getIconComponent } from './ApiMethodSelector';

interface CustomNodeProps extends NodeProps {
  data: WorkflowNodeData;
}
const getNodeColor = (type: WorkflowStepType): string => {
  const colorMap: Record<WorkflowStepType, string> = {
    [WorkflowStepType.SOURCE]: 'bg-green-500',
    [WorkflowStepType.INPUT]: 'bg-blue-500',
    [WorkflowStepType.PROCESSING]: 'bg-green-500',
    [WorkflowStepType.DECISION]: 'bg-yellow-500',
    [WorkflowStepType.OUTPUT]: 'bg-purple-500',
    [WorkflowStepType.SAMPLE]: 'bg-gray-500',
    [WorkflowStepType.INTEGRATION]: 'bg-orange-500',
    [WorkflowStepType.ANALYTICS]: 'bg-pink-500',
  };
  return colorMap[type] || 'bg-gray-500';
};
const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  
  const dispatch = useAppDispatch();
  const { ui } = useAppSelector((state) => state.workflow);

  // Check if this is an End node and render the special End component
  if (data.type === WorkflowStepType.OUTPUT && getConfigSubtype(data.config) === 'end_node') {
    return <EndNode id={id} data={data} selected={selected} {...({} as any)} />;
  }

  
  const stepMetadata = AVAILABLE_STEPS.find(
    step => step.type === data.type && step.subtype === getConfigSubtype(data.config)
  );
  const handleClick = () => {
    dispatch(setSelectedNode(id));
  };


  const hasError = data.hasError;
  const isSelected = selected || ui.selectedNodeId === id;
  const nodeColor = getNodeColor(data.type);
  
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
      <div className={`${nodeColor} p-3 rounded-t-lg`}>
        <div className="flex items-center space-x-2">
          {(() => {
            if (stepMetadata?.icon) {
              return <stepMetadata.icon className="w-5 h-5 text-white" />;
            } else {
              return <SettingsIcon className="w-5 h-5 text-white" />;
            }
          })()}
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

        {/* Error message */}
        {hasError && data.errorMessage && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
            {data.errorMessage}
          </div>
        )}

        {/* API Methods Display for API Search nodes */}
        {data.type === WorkflowStepType.SAMPLE && 
         isIntegrationStepConfig(data.config, data.type) &&
         data.config.subtype === IntegrationStepSubtype.API_SEARCH &&
         getSelectedApiMethods(data.config, data.type).length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1 justify-end">
              {getSelectedApiMethods(data.config, data.type).map((method) => (
                <div
                  key={method.id}
                  className="inline-flex items-center py-1 text-xs gap-1"
                >
                  {React.createElement(getIconComponent(method.id), { className: "w-4 h-4 rounded-sm border border-gray-300 bg-white" })}
                  <span className="font-medium">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Connection Handles */}
      {/* Input handle (except for source nodes) */}
      {data.type !== WorkflowStepType.SOURCE && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400 !border-2 !border-white"
          style={{ top: -5, width: 10, height: 10 }}
        />
      )}

      {/* Output handle (except for output nodes, decision nodes, and conditional branch) */}
      {data.type !== WorkflowStepType.OUTPUT && 
       data.type !== WorkflowStepType.DECISION && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-primary-500 !border-2 !border-white"
          style={{ bottom: -5, width: 10, height: 10 }}
        />
      )}

      {/* Multiple output handles for decision nodes (except conditional branch) */}
      {data.type === WorkflowStepType.DECISION && getConfigSubtype(data.config) !== 'conditional_branch' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!bg-green-500 !border-2 !border-white"
            style={{ bottom: -5, left: '30%', width: 10, height: 10 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!bg-red-500 !border-2 !border-white"
            style={{ bottom: -5, right: '30%', width: 10, height: 10 }}
          />
        </>
      )}

      {/* Single output handle for conditional branch nodes */}
      {data.type === WorkflowStepType.DECISION && getConfigSubtype(data.config) === 'conditional_branch' && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="branch"
          className="!bg-emerald-500 !border-2 !border-white"
          style={{ bottom: -5, width: 10, height: 10 }}
        />
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 bg-primary-500/20 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export default CustomNode;
