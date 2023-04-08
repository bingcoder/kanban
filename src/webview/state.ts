import { create } from "zustand";
import { ConfigOption, TaskRecord, TaskStatus } from "./constants";

export const useTaskList = create<{
  tasks: Record<TaskStatus, TaskRecord[]>;
  updateTasks: (tasks: any) => void;
}>((set) => ({
  tasks: {} as any,
  updateTasks(taskList: TaskRecord[]) {
    const taskMap: any = {};
    taskList.forEach((item) => {
      if (taskMap[item.status]) {
        taskMap[item.status].push(item);
      } else {
        taskMap[item.status] = [item];
      }
    });
    set({ tasks: taskMap });
  },
}));

export const useStatusList = create<{
  status: ConfigOption[];
  updateStatus: (statusList: ConfigOption[]) => void;
}>((set) => ({
  status: [],
  updateStatus(status) {
    set({ status });
  },
}));

export const useDeveloperList = create<{
  developer: ConfigOption[];
  updateDeveloper: (developer: ConfigOption[]) => void;
}>((set) => ({
  developer: [],
  updateDeveloper(developer) {
    set({ developer });
  },
}));
