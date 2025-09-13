import type { Node, Edge } from 'reactflow';

export enum WorkflowStepType {
  SOURCE = 'source',
  INPUT = 'input',
  PROCESSING = 'processing', 
  DECISION = 'decision',
  OUTPUT = 'output',
  SAMPLE = 'sample',
  INTEGRATION = 'integration',
  ANALYTICS = 'analytics',
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
  TRY_CATCH = 'try_catch',
  CONDITIONAL_BRANCH = 'conditional_branch'
}

export enum OutputStepSubtype {
  WEBHOOK_RESPONSE = 'webhook_response',
  FILE_EXPORT = 'file_export',
  DATABASE_INSERT = 'database_insert',
  EMAIL_NOTIFICATION = 'email_notification',
  LOG_OUTPUT = 'log_output',
  END_NODE = 'end_node'
}

export enum IntegrationStepSubtype {
  API_SEARCH = 'api_search',
  ACCOUNT_DISCOVERY = 'account_discovery',
  SAP_ACCOUNTS = 'sap_accounts',
  CIP_ACCOUNTS = 'cip_accounts',
  PACKAGE_RANGE = 'package_range',
  ADVANCED_PACKAGE_RANGE = 'advanced_package_range',
  JOB_LISTINGS_SEARCH = 'job_listings_search',
  ACCOUNT_SEARCH = 'account_search',
  DATA_FILTER = 'data_filter',
  ACCOUNT_DATA_ENRICHMENT = 'account_data_enrichment',
  PERSON_SEARCH = 'person_search',
  TAP_AI_AGENT = 'tap_ai_agent',
  OUTREACH_ACTIVATION = 'outreach_activation'
}

export enum AnalyticsStepSubtype {
  CONTENT_GENERATION = 'content_generation',
  WORKFLOW_NAVIGATION = 'workflow_navigation',
  ACCOUNT_HIERARCHY = 'account_hierarchy',
  DOCUMENT_PROCESSING = 'document_processing'
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
  edgeLabels?: EdgeLabelConfig[];
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

export interface ApiMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface IntegrationStepConfig extends BaseStepConfig {
  subtype: IntegrationStepSubtype;
  apiEndpoint?: string;
  requestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  requestBody?: Record<string, any>;
  responseMapping?: Record<string, string>;
  selectedApiMethods?: ApiMethod[];
}

export interface AnalyticsStepConfig extends BaseStepConfig {
  subtype: AnalyticsStepSubtype;
  algorithm?: string;
  modelPath?: string;
  parameters?: Record<string, any>;
  outputFormat?: 'json' | 'csv' | 'xml';
  edgeLabels?: EdgeLabelConfig[];
}

export type StepConfig = SourceStepConfig | ProcessingStepConfig | DecisionStepConfig | OutputStepConfig | IntegrationStepConfig | AnalyticsStepConfig;

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

export interface EdgeLabelConfig {
  id: string;
  label: string;
  sourceHandle?: string;
  targetHandle?: string;
}
