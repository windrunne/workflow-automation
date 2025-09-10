import { useState, useEffect, FC } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  updateNode, 
  deleteNode, 
  setConfigPanelOpen 
} from '../store/workflowSlice';
import { WorkflowStepType, ConditionOperator } from '../types/workflow';
import type { 
  SourceStepConfig, 
  ProcessingStepConfig, 
  DecisionStepConfig, 
  OutputStepConfig,
  StepConfig
} from '../types/workflow';
import { AVAILABLE_STEPS } from '../constants/workflowSteps';
import { CheckIcon, Circle, SettingsIcon } from 'lucide-react';

interface ConfigPanelProps {
  className?: string;
}

const ConfigPanel: FC<ConfigPanelProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow, ui } = useAppSelector((state) => state.workflow);
  
  const selectedNode = currentWorkflow?.nodes.find(n => n.id === ui.selectedNodeId);

  const [config, setConfig] = useState<StepConfig>(selectedNode?.data.config || {
    name: '',
    description: '',
    enabled: true,
    timeout: 30
  } as StepConfig);

  useEffect(() => {
    if (selectedNode?.data.config) {
      setConfig(selectedNode.data.config);
    }
  }, [selectedNode?.id]);

  if (!selectedNode) {
    return null;
  }

  const stepMetadata = AVAILABLE_STEPS.find(
    step => step.type === selectedNode.data.type && step.subtype === (selectedNode.data.config as any).subtype
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value } as StepConfig;
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    dispatch(updateNode({
      nodeId: selectedNode.id,
      updates: {
        config: config,
        isConfigured: true
      }
    }));
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [selectedNode?.id]);

  const handleClose = () => {
    dispatch(setConfigPanelOpen(false));
  };

  const handleDelete = () => {
    dispatch(deleteNode(selectedNode.id));
  };

  const renderBasicConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Step Name
        </label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => handleConfigChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter step name..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={config.description || ''}
          onChange={(e) => handleConfigChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe what this step does..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enabled"
          checked={config.enabled}
          onChange={(e) => handleConfigChange('enabled', e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
          Enable this step
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout (seconds)
        </label>
        <input
          type="number"
          value={config.timeout || 30}
          onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
          min="1"
          max="3600"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSourceConfig = () => {
    const sourceConfig = config as SourceStepConfig;
    
    return (
      <div className="space-y-4">
        {sourceConfig.subtype === 'webhook' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint Path
              </label>
              <input
                type="text"
                value={sourceConfig.endpoint || ''}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="/webhook/trigger"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={sourceConfig.method || 'POST'}
                onChange={(e) => handleConfigChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </>
        )}

        {sourceConfig.subtype === 'scheduled_trigger' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule (Cron Expression)
            </label>
            <input
              type="text"
              value={sourceConfig.schedule || ''}
              onChange={(e) => handleConfigChange('schedule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0 0 * * *"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: "0 9 * * 1-5" runs at 9 AM on weekdays
            </p>
          </div>
        )}

        {sourceConfig.subtype === 'file_upload' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <input
              type="text"
              value={sourceConfig.filePath || ''}
              onChange={(e) => handleConfigChange('filePath', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder=".csv,.json,.txt"
            />
          </div>
        )}
      </div>
    );
  };

  const renderProcessingConfig = () => {
    const processingConfig = config as ProcessingStepConfig;
    
    return (
      <div className="space-y-4">
        {processingConfig.subtype === 'data_transformation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transformation Script (JavaScript)
            </label>
            <textarea
              value={processingConfig.transformationScript || ''}
              onChange={(e) => handleConfigChange('transformationScript', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder={`// Transform the input data
return {
  ...data,
  processed: true,
  timestamp: new Date().toISOString()
};`}
            />
          </div>
        )}

        {processingConfig.subtype === 'api_call' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <input
                type="url"
                value={processingConfig.apiEndpoint || ''}
                onChange={(e) => handleConfigChange('apiEndpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Headers (JSON)
              </label>
              <textarea
                value={JSON.stringify(processingConfig.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    handleConfigChange('headers', headers);
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder={`{
  "Authorization": "Bearer token",
  "Content-Type": "application/json"
}`}
              />
            </div>
          </>
        )}

        {processingConfig.subtype === 'email_send' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={processingConfig.emailTemplate?.to || ''}
                  onChange={(e) => handleConfigChange('emailTemplate', {
                    ...processingConfig.emailTemplate,
                    to: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Recipient email or template variable"
                />
                <input
                  type="text"
                  value={processingConfig.emailTemplate?.subject || ''}
                  onChange={(e) => handleConfigChange('emailTemplate', {
                    ...processingConfig.emailTemplate,
                    subject: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Email subject"
                />
                <textarea
                  value={processingConfig.emailTemplate?.body || ''}
                  onChange={(e) => handleConfigChange('emailTemplate', {
                    ...processingConfig.emailTemplate,
                    body: e.target.value
                  })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Email body template..."
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDecisionConfig = () => {
    const decisionConfig = config as DecisionStepConfig;
    
    return (
      <div className="space-y-4">
        {decisionConfig.subtype === 'conditional' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conditions
            </label>
            <div className="space-y-3">
              {(decisionConfig.conditions || []).map((condition, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={condition.field}
                      onChange={(e) => {
                        const newConditions = [...(decisionConfig.conditions || [])];
                        newConditions[index] = { ...condition, field: e.target.value };
                        handleConfigChange('conditions', newConditions);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Field name"
                    />
                    <select
                      value={condition.operator}
                      onChange={(e) => {
                        const newConditions = [...(decisionConfig.conditions || [])];
                        newConditions[index] = { ...condition, operator: e.target.value as ConditionOperator };
                        handleConfigChange('conditions', newConditions);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={ConditionOperator.EQUALS}>Equals</option>
                      <option value={ConditionOperator.NOT_EQUALS}>Not Equals</option>
                      <option value={ConditionOperator.GREATER_THAN}>Greater Than</option>
                      <option value={ConditionOperator.LESS_THAN}>Less Than</option>
                      <option value={ConditionOperator.CONTAINS}>Contains</option>
                      <option value={ConditionOperator.IS_EMPTY}>Is Empty</option>
                    </select>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => {
                        const newConditions = [...(decisionConfig.conditions || [])];
                        newConditions[index] = { ...condition, value: e.target.value };
                        handleConfigChange('conditions', newConditions);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Value"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newConditions = [
                    ...(decisionConfig.conditions || []),
                    {
                      field: '',
                      operator: ConditionOperator.EQUALS,
                      value: '',
                      logicalOperator: 'AND' as const
                    }
                  ];
                  handleConfigChange('conditions', newConditions);
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                + Add Condition
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOutputConfig = () => {
    const outputConfig = config as OutputStepConfig;
    
    return (
      <div className="space-y-4">
        {outputConfig.subtype === 'webhook_response' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Template (JSON)
            </label>
            <textarea
              value={outputConfig.responseTemplate || ''}
              onChange={(e) => handleConfigChange('responseTemplate', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder={`{
  "status": "success",
  "data": "{{data}}",
  "timestamp": "{{timestamp}}"
}`}
            />
          </div>
        )}

        {outputConfig.subtype === 'file_export' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Path
              </label>
              <input
                type="text"
                value={outputConfig.filePath || ''}
                onChange={(e) => handleConfigChange('filePath', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="/exports/data.json"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Format
              </label>
              <select
                value={outputConfig.fileFormat || 'json'}
                onChange={(e) => handleConfigChange('fileFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
                <option value="txt">Text</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTypeSpecificConfig = () => {
    switch (selectedNode.data.type) {
      case WorkflowStepType.SOURCE:
        return renderSourceConfig();
      case WorkflowStepType.PROCESSING:
        return renderProcessingConfig();
      case WorkflowStepType.DECISION:
        return renderDecisionConfig();
      case WorkflowStepType.OUTPUT:
        return renderOutputConfig();
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${className} w-80 bg-white border-l border-gray-200 flex flex-col h-full`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded ${stepMetadata?.color || 'bg-gray-500'} flex items-center justify-center text-white text-xs`}>
              {stepMetadata?.icon ? (
                <stepMetadata.icon className="w-4 h-4" />
              ) : (
                <SettingsIcon className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {stepMetadata?.label || 'Configure Step'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {stepMetadata?.description || 'Configure this workflow step'}
        </p>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Configuration */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Settings</h4>
          {renderBasicConfig()}
        </div>

        {/* Type-specific Configuration */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {stepMetadata?.category} Settings
          </h4>
          {renderTypeSpecificConfig()}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        {/* Save Button */}
        <div className="flex items-center justify-end">
          {hasUnsavedChanges && (
            <div className="text-xs text-orange-600 font-medium flex items-center gap-2">
              <div className="flex w-2 h-2 rounded-full bg-orange-600" />
              Unsaved changes
            </div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md transition-colors font-medium text-sm
              ${hasUnsavedChanges 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <CheckIcon className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="text-sm">Delete Step</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
