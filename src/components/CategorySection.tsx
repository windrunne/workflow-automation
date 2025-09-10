import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { StepMetadata } from "../constants/workflowSteps";
import { StepCard } from "./StepCard";

interface CategorySectionProps {
    categoryName: string;
    steps: StepMetadata[];
    isExpanded: boolean;
    onToggle: () => void;
  }
  
export const CategorySection: React.FC<CategorySectionProps> = ({ 
    categoryName, 
    steps, 
    isExpanded, 
    onToggle 
}) => {
    return (
      <div className="mb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-700">{categoryName}</h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {steps.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-2">
            {steps.map((step) => (
              <StepCard key={`${step.type}-${step.subtype}`} step={step} />
            ))}
          </div>
        )}
      </div>
    );
  };