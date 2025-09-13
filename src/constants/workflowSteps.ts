import { ComponentType } from 'react';
import { 
  WorkflowStepType, 
  SourceStepSubtype, 
  ProcessingStepSubtype, 
  DecisionStepSubtype, 
  OutputStepSubtype,
  IntegrationStepSubtype,
} from '../types/workflow';
import {
  LinkIcon,
  GlobeAltIcon,
  DocumentArrowUpIcon,
  CircleStackIcon,
  ClockIcon,
  ArrowPathIcon,
  RadioIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CommandLineIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ArrowRightCircleIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  DocumentArrowDownIcon,
  ServerStackIcon,
  BellIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { SearchIcon } from 'lucide-react';

export interface StepMetadata {
  type: WorkflowStepType;
  subtype: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  category: string;
}

export const AVAILABLE_STEPS: StepMetadata[] = [
  {
    type: WorkflowStepType.SOURCE,
    subtype: SourceStepSubtype.WEBHOOK,
    label: 'Webhook Trigger',
    description: 'Trigger workflow from incoming HTTP requests',
    icon: LinkIcon,
    color: 'bg-green-500',
    category: 'Sources'
  },
  {
    type: WorkflowStepType.SOURCE,
    subtype: SourceStepSubtype.HTTP_REQUEST,
    label: 'HTTP Request',
    description: 'Fetch data from external APIs',
    icon: GlobeAltIcon,
    color: 'bg-green-500',
    category: 'Sources'
  },
  {
    type: WorkflowStepType.SOURCE,
    subtype: SourceStepSubtype.FILE_UPLOAD,
    label: 'File Upload',
    description: 'Process uploaded files',
    icon: DocumentArrowUpIcon,
    color: 'bg-green-500',
    category: 'Sources'
  },
  {
    type: WorkflowStepType.SOURCE,
    subtype: SourceStepSubtype.DATABASE_QUERY,
    label: 'Database Query',
    description: 'Query data from databases',
    icon: CircleStackIcon,
    color: 'bg-green-500',
    category: 'Sources'
  },
  {
    type: WorkflowStepType.SOURCE,
    subtype: SourceStepSubtype.SCHEDULED_TRIGGER,
    label: 'Scheduled Trigger',
    description: 'Run workflow on a schedule',
    icon: ClockIcon,
    color: 'bg-green-500',
    category: 'Sources'
  },

  {
    type: WorkflowStepType.PROCESSING,
    subtype: ProcessingStepSubtype.DATA_TRANSFORMATION,
    label: 'Data Transform',
    description: 'Transform and manipulate data',
    icon: ArrowPathIcon,
    color: 'bg-blue-500',
    category: 'Processing'
  },
  {
    type: WorkflowStepType.PROCESSING,
    subtype: ProcessingStepSubtype.API_CALL,
    label: 'API Call',
    description: 'Make calls to external APIs',
    icon: RadioIcon,
    color: 'bg-blue-500',
    category: 'Processing'
  },
  {
    type: WorkflowStepType.PROCESSING,
    subtype: ProcessingStepSubtype.EMAIL_SEND,
    label: 'Send Email',
    description: 'Send email notifications',
    icon: EnvelopeIcon,
    color: 'bg-blue-500',
    category: 'Processing'
  },
  {
    type: WorkflowStepType.PROCESSING,
    subtype: ProcessingStepSubtype.DATA_VALIDATION,
    label: 'Data Validation',
    description: 'Validate data against rules',
    icon: CheckBadgeIcon,
    color: 'bg-blue-500',
    category: 'Processing'
  },
  {
    type: WorkflowStepType.PROCESSING,
    subtype: ProcessingStepSubtype.CUSTOM_SCRIPT,
    label: 'Custom Script',
    description: 'Execute custom JavaScript code',
    icon: CommandLineIcon,
    color: 'bg-blue-500',
    category: 'Processing'
  },

  {
    type: WorkflowStepType.DECISION,
    subtype: DecisionStepSubtype.CONDITIONAL,
    label: 'If/Then/Else',
    description: 'Branch workflow based on conditions',
    icon: CodeBracketSquareIcon,
    color: 'bg-yellow-500',
    category: 'Decisions'
  },
  {
    type: WorkflowStepType.DECISION,
    subtype: DecisionStepSubtype.SWITCH,
    label: 'Switch Case',
    description: 'Multiple path branching',
    icon: Square3Stack3DIcon,
    color: 'bg-yellow-500',
    category: 'Decisions'
  },
  {
    type: WorkflowStepType.DECISION,
    subtype: DecisionStepSubtype.LOOP,
    label: 'Loop',
    description: 'Repeat steps based on conditions',
    icon: ArrowRightCircleIcon,
    color: 'bg-yellow-500',
    category: 'Decisions'
  },
  {
    type: WorkflowStepType.DECISION,
    subtype: DecisionStepSubtype.TRY_CATCH,
    label: 'Try/Catch',
    description: 'Handle errors and exceptions',
    icon: ShieldCheckIcon,
    color: 'bg-yellow-500',
    category: 'Decisions'
  },

  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.WEBHOOK_RESPONSE,
    label: 'Webhook Response',
    description: 'Send response to webhook caller',
    icon: PaperAirplaneIcon,
    color: 'bg-purple-500',
    category: 'Outputs'
  },
  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.FILE_EXPORT,
    label: 'File Export',
    description: 'Export data to files',
    icon: DocumentArrowDownIcon,
    color: 'bg-purple-500',
    category: 'Outputs'
  },
  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.DATABASE_INSERT,
    label: 'Database Insert',
    description: 'Insert data into databases',
    icon: ServerStackIcon,
    color: 'bg-purple-500',
    category: 'Outputs'
  },
  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.EMAIL_NOTIFICATION,
    label: 'Email Notification',
    description: 'Send email notifications',
    icon: BellIcon,
    color: 'bg-purple-500',
    category: 'Outputs'
  },
  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.LOG_OUTPUT,
    label: 'Log Output',
    description: 'Log workflow results',
    icon: DocumentTextIcon,
    color: 'bg-purple-500',
    category: 'Outputs'
  },

  {
    type: WorkflowStepType.SAMPLE,
    subtype: IntegrationStepSubtype.API_SEARCH,
    label: 'API Search',
    description: 'Search through external APIs',
    icon: SearchIcon,
    color: 'bg-gray-500',
    category: 'Enterprise Integrations'
  },

  {
    type: WorkflowStepType.DECISION,
    subtype: DecisionStepSubtype.CONDITIONAL_BRANCH,
    label: 'Conditional Branch',
    description: 'Based on Persona Classification',
    icon: CodeBracketSquareIcon,
    color: 'bg-emerald-500',
    category: 'Decision Logic'
  },


  {
    type: WorkflowStepType.OUTPUT,
    subtype: OutputStepSubtype.END_NODE,
    label: 'End',
    description: 'Workflow completion node',
    icon: Square3Stack3DIcon,
    color: 'bg-gray-500',
    category: 'Outputs'
  }
];

export const STEP_CATEGORIES = AVAILABLE_STEPS.reduce((acc, step) => {
  if (!acc[step.category]) {
    acc[step.category] = [];
  }
  acc[step.category].push(step);
  return acc;
}, {} as Record<string, StepMetadata[]>);

export const DEFAULT_STEP_CONFIGS = {
  [WorkflowStepType.SOURCE]: {
    name: 'New Source Step',
    description: '',
    enabled: true,
    timeout: 30,
  },
  [WorkflowStepType.PROCESSING]: {
    name: 'New Processing Step',
    description: '',
    enabled: true,
    timeout: 60,
  },
  [WorkflowStepType.DECISION]: {
    name: 'New Decision Step',
    description: '',
    enabled: true,
    timeout: 10,
  },
  [WorkflowStepType.OUTPUT]: {
    name: 'New Output Step',
    description: '',
    enabled: true,
    timeout: 30,
  },
  [WorkflowStepType.SAMPLE]: {
    name: 'New Integration Step',
    description: '',
    enabled: true,
    timeout: 45,
  },
  [WorkflowStepType.ANALYTICS]: {
    name: 'New Analytics Step',
    description: '',
    enabled: true,
    timeout: 60,
  },
};

export const CONNECTION_RULES = {
  [WorkflowStepType.SOURCE]: [
    WorkflowStepType.PROCESSING,
    WorkflowStepType.DECISION,
    WorkflowStepType.OUTPUT,
    WorkflowStepType.SAMPLE,
    WorkflowStepType.ANALYTICS
  ],
  [WorkflowStepType.PROCESSING]: [
    WorkflowStepType.PROCESSING,
    WorkflowStepType.DECISION,
    WorkflowStepType.OUTPUT,
    WorkflowStepType.SAMPLE,
    WorkflowStepType.ANALYTICS
  ],
  [WorkflowStepType.DECISION]: [
    WorkflowStepType.PROCESSING,
    WorkflowStepType.DECISION,
    WorkflowStepType.OUTPUT,
    WorkflowStepType.SAMPLE,
    WorkflowStepType.ANALYTICS
  ],
  [WorkflowStepType.SAMPLE]: [
    WorkflowStepType.PROCESSING,
    WorkflowStepType.DECISION,
    WorkflowStepType.OUTPUT,
    WorkflowStepType.SAMPLE,
    WorkflowStepType.ANALYTICS
  ],
  [WorkflowStepType.ANALYTICS]: [
    WorkflowStepType.PROCESSING,
    WorkflowStepType.DECISION,
    WorkflowStepType.OUTPUT,
    WorkflowStepType.SAMPLE,
    WorkflowStepType.ANALYTICS
  ],
  [WorkflowStepType.OUTPUT]: []
};

export const VALIDATION_RULES = {
  maxNodesPerWorkflow: 100,
  maxEdgesPerNode: 10,
  requiredFields: {
    [WorkflowStepType.SOURCE]: ['name'],
    [WorkflowStepType.PROCESSING]: ['name'],
    [WorkflowStepType.DECISION]: ['name'],
    [WorkflowStepType.OUTPUT]: ['name'],
    [WorkflowStepType.SAMPLE]: ['name'],
    [WorkflowStepType.ANALYTICS]: ['name'],
  }
};
