import React, { useState, useRef, useEffect } from 'react';
import { CloudLightningIcon, Globe2Icon, LampDeskIcon, SearchIcon } from 'lucide-react';
import { ApiMethod } from '../types/workflow';

interface ApiMethodSelectorProps {
  selectedMethods: ApiMethod[];
  onMethodsChange: (methods: ApiMethod[]) => void;
  availableMethods?: ApiMethod[];
}

export const getIconComponent = (iconId: string) => {
  const iconMap = {
    jobsearch: SearchIcon,
    apollo: Globe2Icon,
    wiza: CloudLightningIcon,
    neverbounce: LampDeskIcon,
  } as const;
  
  return iconMap[iconId as keyof typeof iconMap] || SearchIcon;
}

// Default available API methods
const DEFAULT_API_METHODS: ApiMethod[] = [
  { id: 'jobsearch', name: 'JobSearch', enabled: false },
  { id: 'apollo', name: 'Apollo', enabled: false },
  { id: 'wiza', name: 'Wiza', enabled: false },
  { id: 'neverbounce', name: 'NeverBounce', enabled: false },
];
const ApiMethodSelector: React.FC<ApiMethodSelectorProps> = ({
  selectedMethods = [],
  onMethodsChange,
  availableMethods = DEFAULT_API_METHODS
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleMethodToggle = (methodId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const isCurrentlySelected = selectedMethods.some(m => m.id === methodId);
    
    if (isCurrentlySelected) {
      const updatedMethods = selectedMethods.filter(m => m.id !== methodId);
      onMethodsChange(updatedMethods);
    } else {
      const methodToAdd = availableMethods.find(m => m.id === methodId);
      if (methodToAdd) {
        const updatedMethods = [...selectedMethods, { ...methodToAdd, enabled: true }];
        onMethodsChange(updatedMethods);
      }
    }
  };

  
  const selectedCount = selectedMethods.length;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedCount === 0 
              ? 'Select API methods...' 
              : `${selectedCount} method${selectedCount !== 1 ? 's' : ''} selected`
            }
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {availableMethods.map((method) => {
              const isSelected = selectedMethods.some(m => m.id === method.id);
              return (
                <div
                  key={method.id}
                  onClick={(e) => handleMethodToggle(method.id, e)}
                  className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                >
                    <div className="flex items-center flex-1">
                      {React.createElement(getIconComponent(method.id), { className: "w-4 h-4 mr-3 text-gray-500" })}
                      <span className="text-gray-700">{method.name}</span>
                    </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleMethodToggle(method.id);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Selected Methods:</div>
          <div className="flex flex-wrap gap-2">
            {selectedMethods.map((method) => (
              <div 
                key={method.id}
                className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-md"
              >
                {React.createElement(getIconComponent(method.id), { className: "w-3 h-3 mr-1" })}
                <span className="text-xs font-medium text-blue-700">{method.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMethodToggle(method.id, e);
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiMethodSelector;