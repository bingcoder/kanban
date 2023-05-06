import { create } from "zustand";
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
} from "../constants";

const vscode = window.acquireVsCodeApi();

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
    vscode.postMessage(
      new UpdateStatusMessage({
        _id: get().kanban._id,
        status,
      })
    );
  },
  updateDeveloper(developer) {
    vscode.postMessage(
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
  getTasks: () => void;
}>((set) => ({
  tasks: {} as any,
  updateTasks(tasks) {
    set({ tasks });
  },
  addTask(task) {
    vscode.postMessage(
      new AddTaskRequestMessage({
        ...task,
        kanban: useKanban.getState().kanban._id,
      })
    );
  },
  updateTask(task) {
    vscode.postMessage(new UpdateTaskRequestMessage(task));
  },
  // updateTaskStatus(task) {
  //   vscode.postMessage(new UpdateTaskRequestMessage(task));
  // },
  getTasks() {
    vscode.postMessage(
      new GetTasksRequestMessage({
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
