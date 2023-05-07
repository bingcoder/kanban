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

export class UpdateStatusMessage extends KanbanMessage {
  readonly command = "updateStatus";
  constructor(readonly payload: { _id: string; status: ConfigOption[] }) {
    super(payload);
  }
}

export class UpdateDeveloperMessage extends KanbanMessage {
  readonly command = "updateDeveloper";
  constructor(readonly payload: { _id: string; developer: ConfigOption[] }) {
    super(payload);
  }
}

export class GetTasksRequestMessage extends KanbanMessage {
  readonly command = "refreshWebviewTasks";
  constructor(readonly payload: Pick<TaskRecord, "_id">) {
    super(payload);
  }
}

// export class AddTaskRequestMessage extends KanbanMessage {
//   readonly command = "addTask";
//   constructor(readonly payload: Omit<TaskRecord, "_id">) {
//     super(payload);
//   }
// }

export class UpdateTaskRequestMessage extends KanbanMessage {
  readonly command = "updateTask";
  constructor(readonly payload: TaskRecord) {
    super(payload);
  }
}

export type VscodeReceiveMessage =
  | UpdateStatusMessage
  | UpdateDeveloperMessage
  | GetTasksRequestMessage
  | AddTaskRequestMessage
  | UpdateTaskRequestMessage;

export class UpdateKanbanResponseMessage extends KanbanMessage {
  readonly command = "updateKanban";
  constructor(readonly payload: Kanban) {
    super(payload);
  }
}

export class UpdateTasksResponseMessage extends KanbanMessage {
  readonly command = "updateTasks";
  constructor(readonly payload: Record<string, TaskRecord[]>) {
    super(payload);
  }
}

export type WebviewReceiveMessage =
  | UpdateKanbanResponseMessage
  | UpdateTasksResponseMessage;

/********** new ********/

// 获取任务

export class RefreshTasksRequestMessage extends KanbanMessage {
  readonly command = "refreshTasksRequest";
  constructor(
    readonly payload: Pick<TaskRecord, "_id"> &
      Partial<Pick<TaskRecord, "title" | "developer">> & {
        developEndAt?: [string, string];
      }
  ) {
    super(payload);
  }
}

export class RefreshTasksResponseMessage extends KanbanMessage {
  readonly command = "refreshTasksResponse";
  constructor(readonly payload: Record<string, TaskRecord[]>) {
    super(payload);
  }
}

// 添加任务
export class AddTaskRequestMessage extends KanbanMessage {
  readonly command = "addTaskRequest";
  constructor(readonly payload: Omit<TaskRecord, "_id">) {
    super(payload);
  }
}

// 更新任务状态
export class UpdateTaskStatusRequestMessage extends KanbanMessage {
  readonly command = "updateTaskStatus";
  constructor(readonly payload: Pick<TaskRecord, "_id" | "status">) {
    super(payload);
  }
}

export type RequestMessage =
  | RefreshTasksRequestMessage
  | UpdateTaskStatusRequestMessage;

export type ResponseMessage = RefreshTasksResponseMessage;
