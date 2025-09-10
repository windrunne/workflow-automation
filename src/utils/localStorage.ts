import { Workflow } from '../types/workflow';
import { saveAs } from 'file-saver';

const WORKFLOWS_KEY = 'workflow-automation-workflows';
const CURRENT_WORKFLOW_KEY = 'workflow-automation-current';

export const localStorageUtils = {
  saveWorkflows: (workflows: Workflow[]): void => {
    try {
      const serializedWorkflows = workflows.map(workflow => ({
        ...workflow,
        createdAt: workflow.createdAt.toISOString(),
        updatedAt: workflow.updatedAt.toISOString()
      }));
      localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(serializedWorkflows));
    } catch (error) {
      console.error('Failed to save workflows to localStorage:', error);
    }
  },

  loadWorkflows: (): Workflow[] => {
    try {
      const stored = localStorage.getItem(WORKFLOWS_KEY);
      if (!stored) return [];
      
      const workflows = JSON.parse(stored);
      return workflows.map((workflow: any) => ({
        ...workflow,
        createdAt: new Date(workflow.createdAt),
        updatedAt: new Date(workflow.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load workflows from localStorage:', error);
      return [];
    }
  },

  saveCurrentWorkflowId: (workflowId: string | null): void => {
    try {
      if (workflowId) {
        localStorage.setItem(CURRENT_WORKFLOW_KEY, workflowId);
      } else {
        localStorage.removeItem(CURRENT_WORKFLOW_KEY);
      }
    } catch (error) {
      console.error('Failed to save current workflow ID:', error);
    }
  },

  loadCurrentWorkflowId: (): string | null => {
    try {
      return localStorage.getItem(CURRENT_WORKFLOW_KEY);
    } catch (error) {
      console.error('Failed to load current workflow ID:', error);
      return null;
    }
  },

  exportWorkflow: (workflow: Workflow): void => {
    try {
      const filename = `${workflow.name + '-' + new Date().getTime()}`;

      const exportData = {
        ...workflow,
        createdAt: workflow.createdAt.toISOString(),
        updatedAt: workflow.updatedAt.toISOString(),
        exportedAt: new Date().toISOString(),
        version: '1.0',
        format: 'workflow-automation-v1'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      
      saveAs(blob, `${filename}.json`);
    } catch (error) {
      console.error('Failed to export workflow:', error);
      throw error;
    }
  },

  importWorkflow: (jsonString: string): Workflow | null => {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.id || !data.name || !data.nodes || !data.edges) {
        throw new Error('Invalid workflow format');
      }

      return {
        ...data,
        createdAt: new Date(data.createdAt || new Date()),
        updatedAt: new Date(data.updatedAt || new Date())
      };
    } catch (error) {
      console.error('Failed to import workflow:', error);
      return null;
    }
  }
};
