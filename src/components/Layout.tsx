import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createWorkflow, loadWorkflow, loadWorkflowsFromStorage } from '../store/workflowSlice';
import { localStorageUtils } from '../utils/localStorage';

import WorkflowSidebar from './WorkflowSidebar';
import WorkflowCanvas from './WorkflowCanvas';
import ConfigPanel from './ConfigPanel';
import Header from './Header';

const WorkflowBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentWorkflow, workflows, ui } = useAppSelector((state) => state.workflow);

  useEffect(() => {
    const savedWorkflows = localStorageUtils.loadWorkflows();
    const currentWorkflowId = localStorageUtils.loadCurrentWorkflowId();

    if (savedWorkflows.length > 0) {
      dispatch(loadWorkflowsFromStorage(savedWorkflows));

      if (currentWorkflowId) {
        const currentWorkflow = savedWorkflows.find(w => w.id === currentWorkflowId);
        if (currentWorkflow) {
          dispatch(loadWorkflow(currentWorkflowId));
        }
      }
    } else {
      dispatch(createWorkflow({
        name: 'My First Workflow',
        description: 'A simple workflow to get you started'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (workflows.length > 0) {
      localStorageUtils.saveWorkflows(workflows);
    }
  }, [workflows]);

  useEffect(() => {
    if (currentWorkflow && workflows.length > 0) {
      const updatedWorkflows = workflows.map(w => 
        w.id === currentWorkflow.id ? currentWorkflow : w
      );
      localStorageUtils.saveWorkflows(updatedWorkflows);
    }
  }, [currentWorkflow?.isActive, currentWorkflow?.updatedAt]);

  useEffect(() => {
    localStorageUtils.saveCurrentWorkflowId(currentWorkflow?.id || null);
  }, [currentWorkflow?.id]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <WorkflowSidebar />

        <div className="flex-1 relative">
          <WorkflowCanvas className="w-full h-full" />
        </div>

        {ui.isConfigPanelOpen && (
          <ConfigPanel />
        )}
      </div>
    </div>
  );
};

const Layout: React.FC = () => {
  return (
    <Provider store={store}>
      <WorkflowBuilder />
    </Provider>
  );
};

export default Layout;
