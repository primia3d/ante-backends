export interface WorkflowInterface {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface WorkflowStateInterface {
  id: number;
  name: string;
  description: string;
  workflowId: number;
  workflowStateTypeId: number;
  workflow: WorkflowInterface;
  workflowStateType: WorkflowStateTypeInterface;
}

export interface WorkflowStateResponseInterface {
  list: WorkflowStateInterface[];
}

export interface WorkflowStateTypeInterface {
  id: number;
  type: string;
  description: string;
}
