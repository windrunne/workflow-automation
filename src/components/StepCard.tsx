import { StepMetadata } from "../constants/workflowSteps";


interface StepCardProps {
    step: StepMetadata;
  }
  
export const StepCard: React.FC<StepCardProps> = ({ step }) => {
    const onDragStart = (event: React.DragEvent, step: StepMetadata) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({
          type: step.type,
          subtype: step.subtype
        })
      );
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        draggable
        onDragStart={(event) => onDragStart(event, step)}
        className="group bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex items-start space-x-3">
          <div className={`${step.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
            <step.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
              {step.label}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    );
  };