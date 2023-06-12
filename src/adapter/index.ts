import NeDb from "@seald-io/nedb";
import {
  AddTaskRequestMessage,
  AddTaskResponseMessage,
  DeleteTaskRequestMessage,
  DeleteTaskResponseMessage,
  GetKanbanResponseMessage,
  Kanban,
  MessagePayload,
  RefreshTasksRequestMessage,
  RefreshTasksResponseMessage,
  TaskRecord,
  UpdateKanbanDeveloperRequestMessage,
  UpdateKanbanDeveloperResponseMessage,
  UpdateKanbanStatusRequestMessage,
  UpdateKanbanStatusResponseMessage,
  UpdateTaskRequestMessage,
  UpdateTaskResponseMessage,
  UpdateTaskStatusRequestMessage,
  UpdateTaskStatusResponseMessage,
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

  // 刷新任务
  refreshTasks = async (
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
  addTask = async (payload: MessagePayload<AddTaskRequestMessage>) => {
    await this.taskDb.insertAsync(payload as any);
    this.webview.postMessage(new AddTaskResponseMessage());
  };

  // 添加任务
  deleteTask = async (payload: MessagePayload<DeleteTaskRequestMessage>) => {
    await this.taskDb.removeAsync({ _id: payload }, { multi: false });
    this.webview.postMessage(new DeleteTaskResponseMessage());
  };

  // 更新任务状态
  updateTaskStatus = async ({
    _id,
    status,
  }: MessagePayload<UpdateTaskStatusRequestMessage>) => {
    await this.taskDb.updateAsync({ _id }, { $set: { status } });
    this.webview.postMessage(new UpdateTaskStatusResponseMessage());
  };

  // 更新任务
  updateTask = async ({
    _id,
    title,
    status,
    developEndAt,
    developStartAt,
    developer,
    progress,
  }: MessagePayload<UpdateTaskRequestMessage>) => {
    // TODO 优化
    const values = {
      title,
      status,
      developEndAt,
      developStartAt,
      developer,
      progress,
    };

    const set: Partial<typeof values> = {};
    let key: keyof typeof values;

    for (key in values) {
      if (values[key] != null) {
        set[key] = values[key] as any;
      }
    }
    const task = await this.taskDb.findOneAsync({ _id });
    // console.log(task);
    // TODO 优化
    if (status && task.status !== status && status === "ctkbtmhgxu") {
      set.progress = 100;
    }

    await this.taskDb.updateAsync(
      { _id },
      {
        $set: set,
      }
    );
    this.webview.postMessage(new UpdateTaskResponseMessage());
  };

  updateKanbanDevelopers = async ({
    _id,
    developer,
  }: MessagePayload<UpdateKanbanDeveloperRequestMessage>) => {
    await this.kanbanDb.updateAsync({ _id }, { $set: { developer } });
    this.webview.postMessage(new UpdateKanbanDeveloperResponseMessage());
  };

  updateKanbanStatus = async ({
    _id,
    status,
  }: MessagePayload<UpdateKanbanStatusRequestMessage>) => {
    await this.kanbanDb.updateAsync({ _id }, { $set: { status } });
    this.webview.postMessage(new UpdateKanbanStatusResponseMessage());
  };

  getKanban = async () => {
    let kanban = await this.kanbanDb.findAsync({}).sort({ createdAt: 1 });
    if (kanban?.length === 0) {
      await this.kanbanDb.insertAsync({ title: "默认看板" } as any);
    }
    kanban = await this.kanbanDb.findAsync({}).sort({ createdAt: 1 });
    this.webview.postMessage(new GetKanbanResponseMessage(kanban));
  };
}
