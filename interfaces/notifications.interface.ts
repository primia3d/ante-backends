export interface NotificationsInterface {
  id: number;
  content: string;
}

export interface TaskProjectNotificationInterface {
  id: number;
  notificationsId: number;
  receiverId: string;
  projectId: number;
  taskId: number;
  hasRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
