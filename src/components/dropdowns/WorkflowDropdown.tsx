import React, { useState } from 'react';
import { PlusIcon, CheckCircleIcon, StopCircleIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createWorkflow, loadWorkflow } from '../../store/workflowSlice';
import type { Workflow } from '../../types/workflow';
import Dropdown from './Dropdown';

interface WorkflowDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkflowDropdown: React.FC<WorkflowDropdownProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow, workflows } = useAppSelector((state) => state.workflow);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      dispatch(createWorkflow({
        name: newWorkflowName.trim(),
        description: 'New workflow'
      }));
      setNewWorkflowName('');
      setIsCreatingWorkflow(false);
      onClose();
    }
  };

  const handleWorkflowSelect = (workflowId: string) => {
    dispatch(loadWorkflow(workflowId));
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      setIsCreatingWorkflow(false);
      setNewWorkflowName('');
    }
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} width="w-80">
      <div className="p-2">
        {/* Create new workflow */}
        {isCreatingWorkflow ? (
          <div className="flex items-center space-x-2 p-2">
            <input
              type="text"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder="Workflow name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyDown={(e) => handleKeyDown(e, handleCreateWorkflow)}
              autoFocus
            />
            <button
              onClick={handleCreateWorkflow}
              className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm"
            >
              Create
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingWorkflow(true)}
            className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md"
          >
            <PlusIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Create new workflow</span>
          </button>
        )}

        {/* Divider */}
        {workflows.length > 0 && (
          <div className="border-t border-gray-200 my-2" />
        )}

        {/* Existing workflows */}
        <div className="max-h-60 overflow-y-auto">
          {workflows.map((workflow: Workflow) => (
            <div
              key={workflow.id}
              className={`
                flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer
                ${currentWorkflow?.id === workflow.id ? 'bg-primary-50 border border-primary-200' : ''}
              `}
              onClick={() => handleWorkflowSelect(workflow.id)}
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {workflow.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {workflow.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {workflow.isActive ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <StopCircleIcon className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-xs text-gray-400">
                  {workflow.nodes.length} steps
                </span>
              </div>
            </div>
          ))}
        </div>

        {workflows.length === 0 && !isCreatingWorkflow && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No workflows found. Create your first workflow to get started.
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default WorkflowDropdown;
