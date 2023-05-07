import NeDb from "@seald-io/nedb";
import {
  AddTaskRequestMessage,
  GetTasksRequestMessage,
  Kanban,
  MessagePayload,
  RefreshTasksRequestMessage,
  RefreshTasksResponseMessage,
  TaskRecord,
  UpdateKanbanResponseMessage,
  UpdateStatusMessage,
  UpdateTaskStatusRequestMessage,
  UpdateTasksResponseMessage,
} from "../constants";

export class DbAdapter {
  readonly kanbanDb: NeDb<Kanban>;
  readonly taskDb: NeDb<TaskRecord>;
  webview: any;
  constructor(context: {
    kanbanDb: NeDb<Kanban>;
    taskDb: NeDb<TaskRecord>;
    webview: any;
  }) {
    this.kanbanDb = context.kanbanDb;
    this.taskDb = context.taskDb;
    this.webview = context.webview;
  }

  refreshWebviewKanban = async (_id: string) => {
    const kanban = await this.kanbanDb.findOneAsync({ _id });
    this.webview.postMessage(new UpdateKanbanResponseMessage(kanban));
  };

  // 刷新任务
  refreshTasksRequest = async (
    payload: MessagePayload<RefreshTasksRequestMessage>
  ) => {
    const { _id, developer, developEndAt, title } = payload;
    const params: any = { kanban: _id };
    if (developer?.length) {
      params.developer = { $in: developer };
    }
    if (developEndAt) {
      params.developEndAt = { $gte: developEndAt[0], $lte: developEndAt[1] };
    }

    if (title) {
      params.title = { $regex: new RegExp(title) };
    }
    const tasks = await this.taskDb.findAsync(params).sort({ createdAt: 1 });
    if (this.webview) {
      const tasksMap: any = {};
      tasks.forEach((item) => {
        if (tasksMap[item.status]) {
          tasksMap[item.status].push(item);
        } else {
          tasksMap[item.status] = [item];
        }
      });
      this.webview.postMessage(new RefreshTasksResponseMessage(tasksMap));
    }
  };

  // 添加任务
  addTaskRequest = async (payload: MessagePayload<AddTaskRequestMessage>) => {
    await this.taskDb.insertAsync(payload as any);
    await this.refreshTasksRequest({ _id: payload.kanban });
  };

  // 更新任务状态
  updateTaskStatus = async ({
    _id,
    status,
  }: MessagePayload<UpdateTaskStatusRequestMessage>) => {
    const data = await this.taskDb.updateAsync({ _id }, { $set: { status } });
    console.log(data);

    await this.refreshTasksRequest({ _id: "OPdyWO2ZSZvFS8M7" });
  };
}
