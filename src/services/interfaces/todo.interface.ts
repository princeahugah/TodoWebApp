export interface IUser {
  id: string;
  name: string;
  assignedTasks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITask {
  id: string;
  state: string;
  description: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IToolbarActions {
  id: string;
  color: string;
  icon: string;
  title: string;
  handler: () => void;
}
