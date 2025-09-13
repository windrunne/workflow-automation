import { WorkflowStepType } from '../types/workflow';
import type { 
  StepConfig, 
  IntegrationStepConfig, 
  AnalyticsStepConfig
} from '../types/workflow';

// Type guards for step configs
export function isDecisionStepConfig(
  type: WorkflowStepType
) {
  return type === WorkflowStepType.DECISION;
}

export function isIntegrationStepConfig(
  _config: StepConfig, 
  type: WorkflowStepType
): _config is IntegrationStepConfig {
  return type === WorkflowStepType.INTEGRATION || type === WorkflowStepType.SAMPLE;
}

export function isAnalyticsStepConfig(
  _config: StepConfig, 
  type: WorkflowStepType
): _config is AnalyticsStepConfig {
  return type === WorkflowStepType.ANALYTICS;
}

// Helper to safely get subtype from config
export function getConfigSubtype(config: StepConfig): string {
  return (config as any).subtype || '';
}

// Helper to check if config has conditional branch subtype
export function isConditionalBranchConfig(config: StepConfig, type: WorkflowStepType): boolean {
  return isDecisionStepConfig(type) && config.subtype === 'conditional_branch';
}

// Helper to safely get selected API methods from integration config
export function getSelectedApiMethods(config: StepConfig, type: WorkflowStepType) {
  if (isIntegrationStepConfig(config, type)) {
    return config.selectedApiMethods || [];
  }
  return [];
}
