import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  Panel
} from 'reactflow';
import { RocketLaunchIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import type {
  Node,
  Edge,
  Connection,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  addNode,
  addEdge as addWorkflowEdge,
  updateNodePosition,
  deleteNode,
  deleteEdge,
  setSelectedNode,
  setSelectedEdge,
  updateViewport
} from '../store/workflowSlice';
import { WorkflowStepType } from '../types/workflow';
import { AVAILABLE_STEPS } from '../constants/workflowSteps';

import CustomNode from './CustomNode';
import MiniMap from './MiniMap';

const nodeTypes = {
  custom: CustomNode,
};

interface WorkflowCanvasProps {
  className?: string;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow, ui } = useAppSelector((state) => state.workflow);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(currentWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState((currentWorkflow?.edges as Edge[]) || []);

  useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes);
      setEdges(currentWorkflow.edges as Edge[]);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  const onNodesChangeHandler: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          dispatch(updateNodePosition({
            nodeId: change.id,
            position: change.position
          }));
        }
      });
      onNodesChange(changes);
    },
    [dispatch]
  );

  const onEdgesChangeHandler: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          dispatch(deleteEdge(change.id));
        }
      });
      onEdgesChange(changes);
    },
    [dispatch]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        dispatch(addWorkflowEdge({
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
        }));
      }
    },
    [dispatch]
  );

  const onSelectionChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      if (nodes.length > 0) {
        dispatch(setSelectedNode(nodes[0].id));
      } else if (edges.length > 0) {
        dispatch(setSelectedEdge(edges[0].id));
      } else {
        dispatch(setSelectedNode(undefined));
        dispatch(setSelectedEdge(undefined));
      }
    },
    [dispatch]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const stepData = event.dataTransfer.getData('application/reactflow');

      if (!stepData || !reactFlowBounds || !reactFlowInstance) return;

      const { type, subtype } = JSON.parse(stepData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const stepMetadata = AVAILABLE_STEPS.find(
        step => step.type === type && step.subtype === subtype
      );

      if (stepMetadata) {
        dispatch(addNode({
          type: type as WorkflowStepType,
          subtype,
          position,
          config: {
            name: stepMetadata.label,
            description: stepMetadata.description,
            enabled: true,
          }
        }));
      }
    },
    [reactFlowInstance, dispatch]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onMove = useCallback(
    (_: any, viewport: { x: number; y: number; zoom: number }) => {
      dispatch(updateViewport(viewport));
    },
    [dispatch]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (ui.selectedNodeId) {
          dispatch(deleteNode(ui.selectedNodeId));
        } else if (ui.selectedEdgeId) {
          dispatch(deleteEdge(ui.selectedEdgeId));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [ui.selectedNodeId, ui.selectedEdgeId, dispatch]);

  if (!currentWorkflow) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-50`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <WrenchScrewdriverIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Workflow Selected</h3>
          <p className="text-gray-500">Create a new workflow or select an existing one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`} ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onMove={onMove}
          nodeTypes={nodeTypes}
          defaultViewport={{ ...ui.viewport, zoom: ui.zoom }}
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
          snapToGrid={true}
          snapGrid={[20, 20]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2 }
          }}
          fitView
          className="bg-gray-50"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#e2e8f0"
          />
          <Controls 
            position="bottom-right"
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />
          <MiniMap 
            position="bottom-left"
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />
          
          {nodes.length === 0 && (
            <Panel position="top-center" className="pointer-events-none">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 max-w-md">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <RocketLaunchIcon className="w-12 h-12 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Building Your Workflow</h3>
                  <p className="text-gray-500 text-sm">
                    Drag and drop components from the sidebar to create your workflow.
                    Connect them by dragging from the connection points.
                  </p>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowCanvas;
