import axios from "axios";
import type Task from "~/models/task";

export const useTaskService = () => {
  const runtimeConfig = useRuntimeConfig()

  const BASE_URL = runtimeConfig.public.API_URL

  async function getAll() {
    try {
      const response = await axios({
        method: 'GET',
        url: BASE_URL + '/tasks',
      });

      return response.data as Task[];
    } catch (err) {
      console.error('Services:Tasks:getAll: ', err);
      return [] as Task[];
    }
  }

  async function findOne(id: string) {
    try {
      const response = await axios({
        method: 'GET',
        url: BASE_URL + '/tasks/' + id,
      });

      return response.data as Task;
    } catch (err) {
      console.error('Services:Tasks:findOne: ', err);
      return null;
    }
  }

  async function create(task: Partial<Task>) {
    try {
      const response = await axios({
        method: 'POST',
        url: BASE_URL + '/tasks',
        data: {
          content: task?.content ?? '',
          isDone: task?.isDone ?? false,
        },
      });

      return response.data as Task;
    } catch (err) {
      console.error('Services:Tasks:create:', err);
      return null;
    }
  }

  async function update(id: string, task: Partial<Task>) {
    try {
      const response = await axios({
        method: 'PATCH',
        url: BASE_URL + '/tasks/' + id,
        data: {
          content: task?.content ?? '',
          isDone: task?.isDone ?? false,
        },
      });

      return response.data as Task;
    } catch (err) {
      console.error('Services:Tasks:update:', err);
      return null;
    }
  }

  async function remove(id: string) {
    try {
      const response = await axios({
        method: 'DELETE',
        url: BASE_URL + '/tasks/' + id,
      });

      return response.data as Task;
    } catch (err) {
      console.error('Services:Tasks:remove:', err);
      return null;
    }
  }

  return {
    getAll,
    findOne,
    create,
    update,
    remove
  }
}

