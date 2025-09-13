import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateNodeEdgeLabels } from '../store/workflowSlice';
import { WorkflowEdge, WorkflowNode } from '../types/workflow';


interface EdgeLabelsManagerProps {
  nodeId: string;
}

interface EdgeLabelItem {
  edgeId: string;
  label: string;
  targetNodeName?: string;
}

const EdgeLabelsManager: React.FC<EdgeLabelsManagerProps> = ({ nodeId }) => {
  const dispatch = useAppDispatch();
  const { currentWorkflow } = useAppSelector((state) => (state as any).workflow);
  const [edgeLabels, setEdgeLabels] = useState<EdgeLabelItem[]>([]);

  useEffect(() => {
    if (!currentWorkflow || !nodeId) return;
    
    console.log('EdgeLabelsManager useEffect - nodeId:', nodeId);
    
    const outgoingEdges = currentWorkflow.edges.filter((edge: WorkflowEdge) => edge.source === nodeId);
    console.log('outgoingEdges:', outgoingEdges);
    
    const node = currentWorkflow.nodes.find((n: WorkflowNode) => n.id === nodeId);
    console.log('Found node:', node);
    
    const nodeConfig = node?.data.config as any;
    const existingLabels = nodeConfig?.edgeLabels || [];
    console.log('Node config edgeLabels:', existingLabels);

    const initialLabels: EdgeLabelItem[] = outgoingEdges.map((edge: WorkflowEdge) => {
      const edgeData = edge;
      const targetNode = currentWorkflow.nodes.find((n: WorkflowNode) => n.id === edgeData.target);
      const existingLabel = existingLabels.find((l: any) => l.id === edgeData.id);
      
      console.log(`Edge ${edgeData.id}: target=${edgeData.target}, targetNode=${targetNode?.data.config.name}, existingLabel=${existingLabel?.label}, edgeLabel=${edgeData.data?.label}`);
      
      return {
        edgeId: edgeData.id,
        label: existingLabel?.label || edgeData.data?.label || '',
        targetNodeName: targetNode?.data.config.name || 'Unknown Target'
      };
    });

    console.log('Setting initial labels:', initialLabels);
    setEdgeLabels(initialLabels);
  }, [nodeId, currentWorkflow?.id, currentWorkflow?.nodes, currentWorkflow?.edges]);

  const handleLabelChange = (edgeId: string, newLabel: string) => {
    console.log(`Label changed for edge ${edgeId}: "${newLabel}"`);
    setEdgeLabels(prev => prev.map(item => 
      item.edgeId === edgeId ? { ...item, label: newLabel } : item
    ));
  };

  const handleSave = () => {
    console.log('Save clicked! Current labels:', edgeLabels);
    const labelsToUpdate = edgeLabels.map(({ edgeId, label }) => ({
      edgeId,
      label
    }));

    console.log('Dispatching update:', { nodeId, edgeLabels: labelsToUpdate });
    dispatch(updateNodeEdgeLabels({
      nodeId,
      edgeLabels: labelsToUpdate
    }));

    alert('Edge labels saved successfully!');
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Edge Labels</h4>
      </div>

      <div className="space-y-3">
        {edgeLabels.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                → {item.targetNodeName}
              </span>
            </div>
            <input
              type="text"
              value={item.label}
              onChange={(e) => handleLabelChange(item.edgeId, e.target.value)}
              placeholder="Enter edge label..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}

        {edgeLabels.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            <p className="mb-2">No outgoing edges found.</p>
            <p className="text-xs">Connect this node to other nodes, then return here to add edge labels.</p>
          </div>
        )}
      </div>

      {edgeLabels.length > 0 && (
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Labels
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        <p>• Labels will appear in the middle of edges</p>
        <p>• Changes are applied when you click "Save Labels"</p>
        <p>• Use meaningful names for persona classification</p>
      </div>
    </div>
  );
};

export default EdgeLabelsManager;
