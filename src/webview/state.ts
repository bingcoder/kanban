import { create } from "zustand";
import { theme } from "antd";
import {
  AddStatus,
  Kanban,
  TaskRecord,
  ConfigOption,
  UpdateStatusMessage,
  UpdateDeveloperMessage,
  AddTaskRequestMessage,
  UpdateTaskRequestMessage,
  MessagePayload,
  GetTasksRequestMessage,
  RefreshTasksRequestMessage,
  UpdateTaskStatusRequestMessage,
} from "../constants";
import "./dbAdapter";

const adapter = window.dbAdapter();

export const useAlgorithm = create<{
  algorithm: typeof theme.defaultAlgorithm;
  updateTheme: (kanban: any) => void;
  toggleAlgorithm: () => void;
}>((set, get) => ({
  algorithm: theme.defaultAlgorithm,
  updateTheme(algorithm) {
    set({ algorithm });
  },
  toggleAlgorithm() {
    set({
      algorithm:
        get().algorithm === theme.defaultAlgorithm
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
    });
  },
}));

export type SearchCondition = Partial<{
  title: string;
  developer: string[];
  developEndAt: [string, string];
}>;

export const useSearchCondition = create<{
  condition: SearchCondition;
  updateSearchCondition: (condition: SearchCondition) => void;
}>((set) => ({
  condition: {},
  updateSearchCondition(condition) {
    set((s) => ({ condition: { ...s.condition, ...condition } }));
  },
}));

export const useKanban = create<{
  kanban: Kanban;
  updateKanban: (kanban: Kanban) => void;
  updateStatus: (status: ConfigOption[]) => void;
  updateDeveloper: (developer: ConfigOption[]) => void;
}>((set, get) => ({
  kanban: window.vscKanban,
  updateKanban(kanban) {
    set({ kanban });
  },
  updateStatus(status) {
    adapter.postMessage(
      new UpdateStatusMessage({
        _id: get().kanban._id,
        status,
      })
    );
  },
  updateDeveloper(developer) {
    adapter.postMessage(
      new UpdateDeveloperMessage({
        _id: get().kanban._id,
        developer,
      })
    );
  },
}));

export const useTask = create<{
  tasks: Record<string, TaskRecord[]>;
  updateTasks: (tasks: any) => void;
  addTask: (
    task: Omit<MessagePayload<AddTaskRequestMessage>, "kanban">
  ) => void;
  updateTask: (task: MessagePayload<UpdateTaskRequestMessage>) => void;
  updateTaskStatus: (
    payload: MessagePayload<UpdateTaskStatusRequestMessage>
  ) => void;
  getTasks: () => void;
}>((set) => ({
  tasks: {} as any,
  updateTasks(tasks) {
    set({ tasks });
  },
  addTask(task) {
    adapter.postMessage(
      new AddTaskRequestMessage({
        ...task,
        kanban: useKanban.getState().kanban._id,
      })
    );
  },
  updateTask(task) {
    adapter.postMessage(new UpdateTaskRequestMessage(task));
  },
  updateTaskStatus(payload) {
    adapter.postMessage(new UpdateTaskStatusRequestMessage(payload));
  },
  getTasks() {
    adapter.postMessage(
      new RefreshTasksRequestMessage({
        ...useSearchCondition.getState().condition,
        _id: useKanban.getState().kanban._id,
      })
    );
  },
}));

export function useStatus() {
  return useKanban(({ kanban, updateStatus }) => ({
    status: kanban.status,
    statusColumns: [...(kanban.status || []), AddStatus],
    updateStatus,
  }));
}

export function useDeveloper() {
  return useKanban(({ kanban, updateDeveloper }) => ({
    developer: kanban.developer || [],
    updateDeveloper,
  }));
}
