import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteWorkflow } from '../../store/workflowSlice';
import Dropdown from './Dropdown';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ 
  isOpen, 
  onClose, 
  onRename 
}) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow, workflows } = useAppSelector((state) => state.workflow);

  const handleRename = () => {
    onRename();
    onClose();
  };

  const handleDelete = () => {
    if (!currentWorkflow) return;

    if (workflows.length <= 1) {
      alert('Cannot delete the last workflow. Create another workflow first.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${currentWorkflow.name}"? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      dispatch(deleteWorkflow(currentWorkflow.id));
      onClose();
    }
  };

  if (!currentWorkflow) return null;

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} position="right" width="w-48">
      <div className="py-1">
        <button
          onClick={handleRename}
          className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Rename Workflow</span>
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          disabled={workflows.length <= 1}
        >
          <TrashIcon className="w-4 h-4" />
          <span>Delete Workflow</span>
        </button>
      </div>
    </Dropdown>
  );
};

export default SettingsDropdown;
