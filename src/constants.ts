export interface ConfigOption {
  id: string;
  label: string;
}

export interface Kanban {
  _id: string;
  title: string;
  status: ConfigOption[];
  developer: ConfigOption[];
}

export const AddStatus = {
  id: "_ADDCOLUMN",
  label: "添加",
} as const;

export interface TaskRecord {
  _id: string;
  status: string;
  title: string;
  developStartAt: string;
  developEndAt: string;
  developer: string[];
  progress: number;
  kanban: string;
}

const source = "vscKanban";

export class KanbanMessage {
  static readonly source = source;
  readonly source = source;
  constructor(readonly payload?: any) {}
}

export type MessagePayload<T extends KanbanMessage> = T["payload"];

/********** new ********/

// 获取任务
class RefreshTasksMessage extends KanbanMessage {
  readonly command = "refreshTasks";
}

export class RefreshTasksRequestMessage extends RefreshTasksMessage {
  constructor(
    readonly payload: Pick<TaskRecord, "_id"> &
      Partial<Pick<TaskRecord, "title" | "developer">> & {
        developEndAt?: [string, string];
      }
  ) {
    super(payload);
  }
}

export class RefreshTasksResponseMessage extends RefreshTasksMessage {
  constructor(readonly payload: Record<string, TaskRecord[]>) {
    super(payload);
  }
}

// 添加任务
class AddTaskMessage extends KanbanMessage {
  readonly command = "addTask";
}

export class AddTaskRequestMessage extends AddTaskMessage {
  constructor(readonly payload: Omit<TaskRecord, "_id">) {
    super(payload);
  }
}
export class AddTaskResponseMessage extends AddTaskMessage {}

// 更新任务状态
class UpdateTaskStatusMessage extends KanbanMessage {
  readonly command = "updateTaskStatus";
}

export class UpdateTaskStatusRequestMessage extends UpdateTaskStatusMessage {
  constructor(readonly payload: Pick<TaskRecord, "_id" | "status">) {
    super(payload);
  }
}

export class UpdateTaskStatusResponseMessage extends UpdateTaskStatusMessage {}

// 更新任务
class UpdateTaskMessage extends KanbanMessage {
  readonly command = "updateTask";
}

export class UpdateTaskRequestMessage extends UpdateTaskMessage {
  constructor(
    readonly payload: Pick<TaskRecord, "_id"> & Partial<Omit<TaskRecord, "id">>
  ) {
    super(payload);
  }
}
export class UpdateTaskResponseMessage extends UpdateTaskMessage {}

// 删除任务
class DeleteTaskMessage extends KanbanMessage {
  readonly command = "deleteTask";
}

export class DeleteTaskRequestMessage extends DeleteTaskMessage {
  constructor(readonly payload: string) {
    super(payload);
  }
}
export class DeleteTaskResponseMessage extends DeleteTaskMessage {}

// 更新开发者
class UpdateKanbanDeveloperMessage extends KanbanMessage {
  readonly command = "updateKanbanDevelopers";
}

export class UpdateKanbanDeveloperRequestMessage extends UpdateKanbanDeveloperMessage {
  constructor(
    readonly payload: {
      _id: string;
      developer: ConfigOption[];
    }
  ) {
    super(payload);
  }
}

export class UpdateKanbanDeveloperResponseMessage extends UpdateKanbanDeveloperMessage {}

// 更新流程
class UpdateKanbanStatusMessage extends KanbanMessage {
  readonly command = "updateKanbanStatus";
}

export class UpdateKanbanStatusRequestMessage extends UpdateKanbanStatusMessage {
  constructor(
    readonly payload: {
      _id: string;
      status: ConfigOption[];
    }
  ) {
    super(payload);
  }
}

export class UpdateKanbanStatusResponseMessage extends UpdateKanbanStatusMessage {}

// 获取看板信息
class GetKanbanMessage extends KanbanMessage {
  readonly command = "getKanban";
}

export class GetKanbanRequestMessage extends GetKanbanMessage {}

export class GetKanbanResponseMessage extends GetKanbanMessage {
  constructor(readonly kanban: Kanban[]) {
    super(kanban);
  }
}

export type RequestMessage =
  | AddTaskRequestMessage
  | RefreshTasksRequestMessage
  | UpdateTaskRequestMessage
  | UpdateTaskStatusRequestMessage
  | DeleteTaskRequestMessage
  | GetKanbanRequestMessage
  | UpdateKanbanStatusRequestMessage
  | UpdateKanbanDeveloperRequestMessage;

export type ResponseMessage =
  | AddTaskResponseMessage
  | RefreshTasksResponseMessage
  | UpdateTaskStatusResponseMessage
  | UpdateTaskResponseMessage
  | DeleteTaskResponseMessage
  | GetKanbanRequestMessage
  | UpdateKanbanStatusResponseMessage
  | UpdateKanbanDeveloperResponseMessage;
