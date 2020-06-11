import axios from 'axios';
import { ITask } from '../interfaces/todo.interface';

let baseURL = '__TASKS_API_ENDPOINT_PLACEHOLDER__';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3002/api/tasks';
}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default class TasksApi {
  static async getTasks(userId: string) {
    return axios.get(`${baseURL}/${userId}`).then((resp) => resp.data);
  }

  static async saveTask(task: ITask) {
    if (task.id) {
      return axios
        .put(`${baseURL}/${task.id}`, { description: task.description, state: task.state, userId: task.userId })
        .then((resp) => resp.data);
    } else {
      return axios
        .post(`${baseURL}/${task.userId}`, { description: task.description, state: task.state, userId: task.userId })
        .then((resp) => resp.data);
    }
  }

  static async deleteTask(taskId: string) {
    return axios.delete(`${baseURL}/${taskId}`).then((resp) => resp.data);
  }
}
