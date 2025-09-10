import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowUIState, 
  StepConfig
} from '../types/workflow';
import { WorkflowStepType } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowState {
  currentWorkflow: Workflow | null;
  workflows: Workflow[];
  ui: WorkflowUIState;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  currentWorkflow: null,
  workflows: [],
  ui: {
    selectedNodeId: undefined,
    selectedEdgeId: undefined,
    isConfigPanelOpen: false,
    draggedStepType: undefined,
    zoom: 1,
    viewport: { x: 0, y: 0 },
    sidebarCollapsed: false
  },
  isLoading: false,
  error: null
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    createWorkflow: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const newWorkflow: Workflow = {
        id: uuidv4(),
        name: action.payload.name,
        description: action.payload.description,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        nodes: [],
        edges: [],
        isActive: false,
        tags: []
      };
      state.workflows.push(newWorkflow);
      state.currentWorkflow = newWorkflow;
    },

    loadWorkflow: (state, action: PayloadAction<string>) => {
      const workflow = state.workflows.find(w => w.id === action.payload);
      if (workflow) {
        state.currentWorkflow = workflow;
      }
    },

    updateWorkflowMetadata: (state, action: PayloadAction<Partial<Pick<Workflow, 'name' | 'description' | 'tags' | 'isActive'>>>) => {
      if (state.currentWorkflow) {
        Object.assign(state.currentWorkflow, action.payload);
        state.currentWorkflow.updatedAt = new Date();
        
        const workflowIndex = state.workflows.findIndex(w => w.id === state.currentWorkflow!.id);
        if (workflowIndex !== -1) {
          state.workflows[workflowIndex] = state.currentWorkflow;
        }
      }
    },

    deleteWorkflow: (state, action: PayloadAction<string>) => {
      const workflowToDelete = action.payload;
      state.workflows = state.workflows.filter(w => w.id !== workflowToDelete);
      
      if (state.currentWorkflow?.id === workflowToDelete) {
        if (state.workflows.length > 0) {
          state.currentWorkflow = state.workflows[0];
        } else {
          state.currentWorkflow = null;
        }
      }
    },

    addNode: (state, action: PayloadAction<{
      type: WorkflowStepType;
      subtype: string;
      position: { x: number; y: number };
      config: Partial<StepConfig>;
    }>) => {
      if (!state.currentWorkflow) return;

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type: 'custom',
        position: action.payload.position,
        data: {
          type: action.payload.type,
          config: {
            name: `${action.payload.type} Step`,
            description: '',
            enabled: true,
            subtype: action.payload.subtype,
            ...action.payload.config
          } as StepConfig,
          position: action.payload.position,
          isConfigured: false,
          hasError: false
        }
      };

      state.currentWorkflow.nodes.push(newNode);
      state.currentWorkflow.updatedAt = new Date();
      
      const workflowIndex = state.workflows.findIndex(w => w.id === state.currentWorkflow!.id);
      if (workflowIndex !== -1) {
        state.workflows[workflowIndex] = state.currentWorkflow;
      }
      
      state.ui.selectedNodeId = newNode.id;
      state.ui.isConfigPanelOpen = true;
    },

    updateNode: (state, action: PayloadAction<{
      nodeId: string;
      updates: Partial<WorkflowNode['data']>;
    }>) => {
      if (!state.currentWorkflow) return;

      const nodeIndex = state.currentWorkflow.nodes.findIndex(n => n.id === action.payload.nodeId);
      if (nodeIndex !== -1) {
        state.currentWorkflow.nodes[nodeIndex].data = {
          ...state.currentWorkflow.nodes[nodeIndex].data,
          ...action.payload.updates
        };
        state.currentWorkflow.updatedAt = new Date();
      }
    },

    updateNodePosition: (state, action: PayloadAction<{
      nodeId: string;
      position: { x: number; y: number };
    }>) => {
      if (!state.currentWorkflow) return;

      const node = state.currentWorkflow.nodes.find(n => n.id === action.payload.nodeId);
      if (node) {
        node.position = action.payload.position;
        node.data.position = action.payload.position;
        state.currentWorkflow.updatedAt = new Date();
      }
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      if (!state.currentWorkflow) return;

      state.currentWorkflow.nodes = state.currentWorkflow.nodes.filter(n => n.id !== action.payload);

      state.currentWorkflow.edges = state.currentWorkflow.edges.filter(
        e => (e as any).source !== action.payload && (e as any).target !== action.payload
      );

      state.currentWorkflow.updatedAt = new Date();

      const workflowIndex = state.workflows.findIndex(w => w.id === state.currentWorkflow!.id);
      if (workflowIndex !== -1) {
        state.workflows[workflowIndex] = state.currentWorkflow;
      }

      if (state.ui.selectedNodeId === action.payload) {
        state.ui.selectedNodeId = undefined;
        state.ui.isConfigPanelOpen = false;
      }
    },

    addEdge: (state, action: PayloadAction<{
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
      label?: string;
      condition?: string;
    }>) => {
      if (!state.currentWorkflow) return;

      const newEdge: WorkflowEdge = {
        id: uuidv4(),
        source: action.payload.source,
        target: action.payload.target,
        sourceHandle: action.payload.sourceHandle,
        targetHandle: action.payload.targetHandle,
        type: 'smoothstep',
        animated: true,
        data: {
          label: action.payload.label,
          condition: action.payload.condition
        }
      } as WorkflowEdge;

      state.currentWorkflow.edges.push(newEdge);
      state.currentWorkflow.updatedAt = new Date();
    },


    deleteEdge: (state, action: PayloadAction<string>) => {
      if (!state.currentWorkflow) return;

      state.currentWorkflow.edges = state.currentWorkflow.edges.filter(e => (e as any).id !== action.payload);
      state.currentWorkflow.updatedAt = new Date();

      if (state.ui.selectedEdgeId === action.payload) {
        state.ui.selectedEdgeId = undefined;
      }
    },

    setSelectedNode: (state, action: PayloadAction<string | undefined>) => {
      state.ui.selectedNodeId = action.payload;
      state.ui.selectedEdgeId = undefined;
      if (action.payload && !state.ui.isConfigPanelOpen) {
        state.ui.isConfigPanelOpen = true;
      } else if (!action.payload) {
        state.ui.isConfigPanelOpen = false;
      }
    },

    setSelectedEdge: (state, action: PayloadAction<string | undefined>) => {
      state.ui.selectedEdgeId = action.payload;
      state.ui.selectedNodeId = undefined;
      state.ui.isConfigPanelOpen = false;
    },

    toggleConfigPanel: (state) => {
      state.ui.isConfigPanelOpen = !state.ui.isConfigPanelOpen;
    },

    setConfigPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.isConfigPanelOpen = action.payload;
    },

    setDraggedStepType: (state, action: PayloadAction<WorkflowStepType | undefined>) => {
      state.ui.draggedStepType = action.payload;
    },

    updateViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.ui.viewport = { x: action.payload.x, y: action.payload.y };
      state.ui.zoom = action.payload.zoom;
    },

    toggleSidebar: (state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
    },

    importWorkflow: (state, action: PayloadAction<Workflow>) => {
      const workflow = { ...action.payload, id: uuidv4() };
      state.workflows.push(workflow);
      state.currentWorkflow = workflow;
    },

    loadWorkflowsFromStorage: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows = action.payload;
      if (action.payload.length > 0 && !state.currentWorkflow) {
        state.currentWorkflow = action.payload[0];
      }
    },

    duplicateWorkflow: (state, action: PayloadAction<string>) => {
      const originalWorkflow = state.workflows.find(w => w.id === action.payload);
      if (originalWorkflow) {
        const duplicatedWorkflow: Workflow = {
          ...originalWorkflow,
          id: uuidv4(),
          name: `${originalWorkflow.name} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
          nodes: originalWorkflow.nodes.map(node => ({
            ...node,
            id: uuidv4()
          })),
          edges: originalWorkflow.edges.map(edge => ({
            ...edge,
            id: uuidv4()
          }))
        };
        state.workflows.push(duplicatedWorkflow);
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  createWorkflow,
  loadWorkflow,
  updateWorkflowMetadata,
  deleteWorkflow,
  addNode,
  updateNode,
  updateNodePosition,
  deleteNode,
  addEdge,
  deleteEdge,
  setSelectedNode,
  setSelectedEdge,
  toggleConfigPanel,
  setConfigPanelOpen,
  setDraggedStepType,
  updateViewport,
  toggleSidebar,
  importWorkflow,
  loadWorkflowsFromStorage,
  duplicateWorkflow,
  setError,
  setLoading,
  clearError
} = workflowSlice.actions;

export default workflowSlice.reducer;
