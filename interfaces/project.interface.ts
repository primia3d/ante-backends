import { ClientInterface } from './client.interface';

export enum ProjectStatus {
  project = 'project',
  lead = 'lead',
}

export interface ProjectInterface {
  id: number;
  name: string;
  description: string;
  budget: number;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  client: ClientInterface;
  isDeleted: boolean;
}
