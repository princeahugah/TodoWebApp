import axios from 'axios';
import { IUser } from '../interfaces/todo.interface';

let baseURL = '__USERS_API_ENDPOINT_PLACEHOLDER__';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3001/api/users';
}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default class UsersApi {
  static async getUsers() {
    return axios.get(`${baseURL}`).then((resp) => resp.data);
  }

  static async getUser(userId: string) {
    return axios.get(`${baseURL}/${userId}`).then((resp) => resp.data);
  }

  static async saveUser(user: IUser) {
    if (user.id) {
      return axios.put(`${baseURL}/${user.id}`, { name: user.name }).then((resp) => resp.data);
    } else {
      return axios.post(`${baseURL}`, { name: user.name }).then((resp) => resp.data);
    }
  }

  static async deleteUser(userId: string) {
    return axios.delete(`${baseURL}/${userId}`).then((resp) => resp.data);
  }
}
