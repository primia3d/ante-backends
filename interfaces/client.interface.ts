import { ProjectInterface } from './project.interface';

export interface ClientInterface {
  id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  Project: ProjectInterface[];
}
