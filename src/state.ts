import { create } from "zustand";
import { ConfigOption, config, getOptions, getTasks } from "./utils/request";
import { StatusRecord, TaskRecord, TaskStatus } from "./constants";
import { useRequest } from "ahooks";

interface StatusState {
  status: StatusRecord[];
  getStatus: () => void;
}

export const useTaskList = create<{
  tasks: Record<TaskStatus, TaskRecord[]>;
  getTasks: () => void;
  updateTasks: (tasks: any) => void;
}>((set) => ({
  tasks: {} as any,
  updateTasks: (tasks) => {
    set({ tasks });
  },
  getTasks: async () => {
    const list = await getTasks();
    set({ tasks: list });
  },
}));

export const useStatusList = create<{
  status: { label: string; value: TaskStatus }[];
  getStatus: () => void;
}>((set) => ({
  status: [],
  getStatus: async () => {
    const list = await getOptions("status");
    set({ status: list as any });
  },
}));

export const useDeveloperList = create<{
  developer: ConfigOption[];
  getDeveloper: () => void;
}>((set) => ({
  developer: [],
  getDeveloper: async () => {
    const list = await getOptions("developer");
    set({ developer: list });
  },
}));
