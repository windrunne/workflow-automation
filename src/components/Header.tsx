import React, { FC, useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  StopCircleIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  updateWorkflowMetadata, 
  duplicateWorkflow,
  importWorkflow
} from '../store/workflowSlice';
import { localStorageUtils } from '../utils/localStorage';
import { ChevronDownIcon } from 'lucide-react';
import WorkflowDropdown from './dropdowns/WorkflowDropdown';
import SettingsDropdown from './dropdowns/SettingsDropdown';

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow } = useAppSelector((state) => state.workflow);
  const [isWorkflowMenuOpen, setIsWorkflowMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');


  const handleExportWorkflow = () => {
    if (currentWorkflow) {
      try {
        localStorageUtils.exportWorkflow(currentWorkflow);
      } catch (error) {
        console.error('Export failed:', error);
      }
    } else {
      alert('No workflow selected to export');
    }
  };

  const handleImportWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const workflow = localStorageUtils.importWorkflow(content);
        if (workflow) {
          dispatch(importWorkflow(workflow));
        } else {
          alert('Failed to import workflow. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }

    event.target.value = '';
  };

  const handleDuplicateWorkflow = () => {
    if (currentWorkflow) {
      dispatch(duplicateWorkflow(currentWorkflow.id));
    }
  };

  const toggleWorkflowActive = () => {
    if (currentWorkflow) {
      dispatch(updateWorkflowMetadata({
        isActive: !currentWorkflow.isActive
      }));
    }
  };

  const handleStartRename = () => {
    if (currentWorkflow) {
      setRenameValue(currentWorkflow.name);
      setIsRenaming(true);
    }
  };

  const handleRenameWorkflow = () => {
    if (renameValue.trim() && currentWorkflow) {
      dispatch(updateWorkflowMetadata({
        name: renameValue.trim()
      }));
      setIsRenaming(false);
      setRenameValue('');
    }
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setRenameValue('');
  };

  return (
    <header className={`${className} bg-white border-b border-gray-200 px-6 py-4`}>
      <div className="flex items-center justify-between">
        {/* Left section - Logo and workflow info */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
          </div>

          {/* Workflow selector */}
          <div className="relative">
            {isRenaming ? (
              <div className="flex items-center space-x-2 px-4 py-2">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameWorkflow();
                    if (e.key === 'Escape') handleCancelRename();
                  }}
                  onBlur={handleRenameWorkflow}
                  autoFocus
                />
                <button
                  onClick={handleRenameWorkflow}
                  className="px-2 py-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelRename}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWorkflowMenuOpen(!isWorkflowMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">
                  {currentWorkflow?.name || 'No workflow selected'}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
            )}

            <WorkflowDropdown 
              isOpen={isWorkflowMenuOpen} 
              onClose={() => setIsWorkflowMenuOpen(false)} 
            />
          </div>

          {/* Workflow status */}
          {currentWorkflow && (
            <div className="flex items-center gap-2">
              {currentWorkflow.isActive ? (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-500" />
              )}
              <span className={`text-sm font-medium ${currentWorkflow.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {currentWorkflow.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Workflow actions */}
          {currentWorkflow && (
            <>
              {/* Play/Pause button */}
              <button
                onClick={toggleWorkflowActive}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm
                  ${currentWorkflow.isActive 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  }
                `}
              >
                {currentWorkflow.isActive ? (
                  <>
                    <PauseIcon className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    <span>Activate</span>
                  </>
                )}
              </button>

              {/* Duplicate workflow */}
              <button
                onClick={handleDuplicateWorkflow}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Duplicate workflow"
              >
                <DocumentDuplicateIcon className="w-5 h-5" />
              </button>

              {/* Export workflow */}
              <button
                onClick={handleExportWorkflow}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export workflow"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Import workflow */}
          <label className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Import workflow">
            <ArrowUpTrayIcon className="w-5 h-5" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportWorkflow}
              className="hidden"
            />
          </label>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>

            <SettingsDropdown
              isOpen={isSettingsMenuOpen}
              onClose={() => setIsSettingsMenuOpen(false)}
              onRename={handleStartRename}
            />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
