import { create } from "zustand";
import { theme } from "antd";
import {
  AddStatus,
  Kanban,
  TaskRecord,
  ConfigOption,
  AddTaskRequestMessage,
  UpdateTaskRequestMessage,
  MessagePayload,
  RefreshTasksRequestMessage,
  DeleteTaskRequestMessage,
  UpdateKanbanDeveloperRequestMessage,
  UpdateKanbanStatusRequestMessage,
} from "../constants";
import {
  addTaskService,
  deleteTaskService,
  getKanban,
  refreshTasksService,
  updateKanbanDeveloperService,
  updateKanbanStatusService,
  updateTaskService,
} from "./utils/request";

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
  kanban: Kanban[];
  activeKanban: Kanban | null;
  getKanban: () => Promise<void>;
  updateKanban: (kanban: Kanban[]) => void;
  updateActiveKanban: (kanban?: Kanban) => void;
  updateKanbanStatus: (status: ConfigOption[]) => Promise<void>;
  updateKanbanDevelopers: (
    developer: MessagePayload<UpdateKanbanDeveloperRequestMessage>["developer"]
  ) => Promise<void>;
}>((set, get) => ({
  kanban: [],
  activeKanban: null,
  updateActiveKanban(kanban) {
    set({
      activeKanban: kanban,
    });
  },
  updateKanban(kanban) {
    set({ kanban });
  },
  async getKanban() {
    const res: Kanban[] = await getKanban();
    if (Array.isArray(res) && res.length) {
      get().updateKanban(res);
      const activeKanbanId = localStorage.getItem("activeKanbanId");
      const activeKanban = activeKanbanId
        ? res.find((item) => item._id === activeKanbanId)
        : res[0];
      get().updateActiveKanban(activeKanban);
      console.log(activeKanban);
    }
  },
  async updateKanbanDevelopers(developer) {
    await updateKanbanDeveloperService(
      new UpdateKanbanDeveloperRequestMessage({
        _id: useKanban.getState().activeKanban!._id,
        developer,
      })
    );
    useTask.getState().refreshTasks();
    get().getKanban();
  },

  async updateKanbanStatus(status) {
    await updateKanbanStatusService(
      new UpdateKanbanStatusRequestMessage({
        _id: useKanban.getState().activeKanban!._id,
        status,
      })
    );
    useTask.getState().refreshTasks();
    get().getKanban();
  },
}));

export const useTask = create<{
  tasks: Record<string, TaskRecord[]>;
  updateTasks: (tasks: any) => void;
  addTask: (
    task: Omit<MessagePayload<AddTaskRequestMessage>, "kanban">
  ) => Promise<void>;
  updateTask: (task: MessagePayload<UpdateTaskRequestMessage>) => Promise<void>;
  refreshTasks: () => Promise<void>;
  deleteTask: (id: MessagePayload<DeleteTaskRequestMessage>) => Promise<void>;
}>((set) => ({
  tasks: {} as any,
  updateTasks(tasks) {
    set({ tasks });
  },
  async addTask(task) {
    await addTaskService(
      new AddTaskRequestMessage({
        ...task,
        kanban: useKanban.getState().activeKanban!._id,
      })
    );
    await useTask.getState().refreshTasks();
  },
  async updateTask(task) {
    await updateTaskService(new UpdateTaskRequestMessage(task));
    // TODO 优化
    await useTask.getState().refreshTasks();
  },
  async refreshTasks() {
    const tasks = await refreshTasksService(
      new RefreshTasksRequestMessage({
        ...useSearchCondition.getState().condition,
        _id: useKanban.getState().activeKanban?._id || "",
      })
    );
    set({ tasks });
  },
  async deleteTask(payload) {
    await deleteTaskService(new DeleteTaskRequestMessage(payload));
    await useTask.getState().refreshTasks();
  },
}));

export function useStatus() {
  return useKanban(({ activeKanban, updateKanbanStatus }) => ({
    status: activeKanban?.status || [],
    statusColumns: [...(activeKanban?.status || []), AddStatus],
    updateKanbanStatus,
  }));
}

export function useDeveloper() {
  return useKanban(({ activeKanban, updateKanbanDevelopers }) => ({
    developer: activeKanban?.developer || [],
    updateKanbanDevelopers,
  }));
}
