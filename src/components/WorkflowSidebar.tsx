import React, { useMemo, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useDebounce } from '../hooks/useDebounce';
import { toggleSidebar } from '../store/workflowSlice';
import { STEP_CATEGORIES } from '../constants/workflowSteps';
import type { StepMetadata } from '../constants/workflowSteps';
import { CategorySection } from './CategorySection';
import { LoaderCircle, SearchIcon } from 'lucide-react';

interface WorkflowSidebarProps {
  className?: string;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { ui } = useAppSelector((state) => state.workflow);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Sources', 'Processing'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isSearching = searchTerm !== debouncedSearchTerm;

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSidebarCollapse = () => {
    dispatch(toggleSidebar());
  };

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) return STEP_CATEGORIES;
    
    const filtered: Record<string, StepMetadata[]> = {};
    Object.entries(STEP_CATEGORIES).forEach(([categoryName, steps]) => {
      const filteredSteps = steps.filter(step => 
        step.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        step.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      if (filteredSteps.length > 0) {
        filtered[categoryName] = filteredSteps;
      }
    });
    return filtered;
  }, [debouncedSearchTerm]);

  if (ui.sidebarCollapsed) {
    return (
      <div className={`${className} w-12 bg-white border-r border-gray-200 flex flex-col`}>
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={toggleSidebarCollapse}
            className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Bars3Icon />
          </button>
        </div>
        
        {/* Vertical category indicators */}
        <div className="flex-1 py-4 space-y-3">
          {Object.entries(STEP_CATEGORIES).map(([categoryName, steps]) => (
            <div
              key={categoryName}
              className="relative group cursor-pointer"
              onClick={toggleSidebarCollapse}
            >
              <div className="w-6 h-6 mx-auto bg-gray-200 rounded flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-xs text-gray-600">{steps.length}</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {categoryName}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} w-80 bg-white border-r border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Components</h2>
          <button
            onClick={toggleSidebarCollapse}
            className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Bars3Icon />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Drag components onto the canvas to build your workflow
        </p>
      </div>

      {/* Search/Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <LoaderCircle className='animate-spin w-4 h-4' />
            ) : (
              <SearchIcon className='text-gray-500 w-4 h-4'/>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {Object.entries(filteredCategories).map(([categoryName, steps]) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              steps={steps}
              isExpanded={expandedCategories.has(categoryName) || debouncedSearchTerm !== ''}
              onToggle={() => toggleCategory(categoryName)}
            />
          ))}
          {Object.keys(filteredCategories).length === 0 && debouncedSearchTerm && (
            <div className="text-center py-8 text-gray-500">
              <p>No components found for "{debouncedSearchTerm}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
