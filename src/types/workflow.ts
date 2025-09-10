import type { Node, Edge } from 'reactflow';

export enum WorkflowStepType {
  SOURCE = 'source',
  PROCESSING = 'processing', 
  DECISION = 'decision',
  OUTPUT = 'output'
}

export enum SourceStepSubtype {
  WEBHOOK = 'webhook',
  HTTP_REQUEST = 'http_request',
  FILE_UPLOAD = 'file_upload',
  DATABASE_QUERY = 'database_query',
  SCHEDULED_TRIGGER = 'scheduled_trigger'
}

export enum ProcessingStepSubtype {
  DATA_TRANSFORMATION = 'data_transformation',
  API_CALL = 'api_call',
  EMAIL_SEND = 'email_send',
  DATA_VALIDATION = 'data_validation',
  CUSTOM_SCRIPT = 'custom_script'
}

export enum DecisionStepSubtype {
  CONDITIONAL = 'conditional',
  SWITCH = 'switch',
  LOOP = 'loop',
  TRY_CATCH = 'try_catch'
}

export enum OutputStepSubtype {
  WEBHOOK_RESPONSE = 'webhook_response',
  FILE_EXPORT = 'file_export',
  DATABASE_INSERT = 'database_insert',
  EMAIL_NOTIFICATION = 'email_notification',
  LOG_OUTPUT = 'log_output'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  REGEX_MATCH = 'regex_match'
}

export interface BaseStepConfig {
  name: string;
  description?: string;
  enabled: boolean;
  timeout?: number;
}

export interface SourceStepConfig extends BaseStepConfig {
  subtype: SourceStepSubtype;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  schedule?: string;
  filePath?: string;
  query?: string;
}

export interface ProcessingStepConfig extends BaseStepConfig {
  subtype: ProcessingStepSubtype;
  transformationScript?: string;
  apiEndpoint?: string;
  headers?: Record<string, string>;
  emailTemplate?: {
    to: string;
    subject: string;
    body: string;
  };
  validationRules?: {
    field: string;
    required: boolean;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    pattern?: string;
  }[];
  customScript?: string;
}

export interface DecisionStepConfig extends BaseStepConfig {
  subtype: DecisionStepSubtype;
  conditions?: {
    field: string;
    operator: ConditionOperator;
    value: any;
    logicalOperator?: 'AND' | 'OR';
  }[];
  switchField?: string;
  switchCases?: {
    value: any;
    outputPath: string;
  }[];
  loopCondition?: {
    field: string;
    operator: ConditionOperator;
    value: any;
  };
  maxIterations?: number;
}

export interface OutputStepConfig extends BaseStepConfig {
  subtype: OutputStepSubtype;
  responseTemplate?: string;
  filePath?: string;
  fileFormat?: 'json' | 'csv' | 'xml' | 'txt';
  tableName?: string;
  emailRecipients?: string[];
  logLevel?: 'info' | 'warn' | 'error' | 'debug';
}

export type StepConfig = SourceStepConfig | ProcessingStepConfig | DecisionStepConfig | OutputStepConfig;

export interface WorkflowNodeData {
  type: WorkflowStepType;
  config: StepConfig;
  position: { x: number; y: number };
  isConfigured: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData;
}

export type WorkflowEdge = Edge;

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  tags?: string[];
}

export interface WorkflowUIState {
  selectedNodeId?: string;
  selectedEdgeId?: string;
  isConfigPanelOpen: boolean;
  draggedStepType?: WorkflowStepType;
  zoom: number;
  viewport: { x: number; y: number };
  sidebarCollapsed: boolean;
}
