import {
  AddTaskRequestMessage,
  AddTaskResponseMessage,
  DeleteTaskRequestMessage,
  DeleteTaskResponseMessage,
  GetKanbanRequestMessage,
  KanbanMessage,
  RequestMessage,
  ResponseMessage,
  UpdateKanbanDeveloperRequestMessage,
  UpdateKanbanStatusRequestMessage,
  UpdateKanbanStatusResponseMessage,
  UpdateTaskRequestMessage,
  UpdateTaskResponseMessage,
  UpdateTaskStatusRequestMessage,
  UpdateTaskStatusResponseMessage,
} from "../../constants";
import { DbAdapter } from "../../adapter";

import "@/lib/nedb";
import { RefreshTasksRequestMessage } from "../../constants";
import { RefreshTasksResponseMessage } from "../../constants";

class PostMessagePromise {
  readonly dataMap: any = {};
  constructor() {
    window.addEventListener("message", (e: MessageEvent<ResponseMessage>) => {
      const message = e.data;

      if (message?.source === KanbanMessage.source) {
        console.log("response====>", message.command);
        // TODO reject
        this.dataMap[message.command].resolve(message.payload);
      }
    });
  }
}

const postMessagePromise = new PostMessagePromise();

const isVscode = "acquireVsCodeApi" in window;

if (!isVscode) {
  // web 环境
  const kanbanDb = new window.Nedb({
    filename: "db/kanban.db",
    autoload: true,
    timestampData: true,
  });

  const taskDb = new window.Nedb({
    filename: "db/task.db",
    autoload: true,
    timestampData: true,
  });
  // @ts-ignore
  window.kanbanDb = kanbanDb;

  const adapter = new DbAdapter({
    kanbanDb,
    taskDb,
    webview: window,
  });

  document.addEventListener("kanbanMessage", (e: any) => {
    if (e.detail?.source === "vscKanban") {
      const { command, payload } = e.detail;
      const commander = adapter[command as keyof typeof adapter];
      if (typeof commander === "function") {
        commander(payload);
      }
    }
  });
}

const vscode = window.acquireVsCodeApi?.();

// 检查key是否符合
const dbAdapter = new DbAdapter({} as any);

const adapter = {
  postMessage<T extends ResponseMessage>(data: RequestMessage) {
    return new Promise<T["payload"]>((resolve, reject) => {
      const commander = dbAdapter[data.command as keyof typeof dbAdapter];
      // console.log("request===>", data.command, data.payload);

      if (typeof commander !== "function") {
        return reject(`web adapter command ${data.command} is not exist`);
      }
      if (isVscode && vscode) {
        vscode.postMessage(data);
      } else {
        const kanbanEvent = new CustomEvent("kanbanMessage", { detail: data });
        document.dispatchEvent(kanbanEvent);
      }
      setTimeout(() => {
        reject(`${data.command} 请求超时！`);
      }, 10000);
      postMessagePromise.dataMap[data.command] = {
        resolve,
        reject,
      };
    });
    // TODO 统一处理异常
  },
};

export const getKanban = () =>
  adapter.postMessage(new GetKanbanRequestMessage());

export const addTaskService = (params: AddTaskRequestMessage) =>
  adapter.postMessage<AddTaskResponseMessage>(params);

export const refreshTasksService = (params: RefreshTasksRequestMessage) =>
  adapter.postMessage<RefreshTasksResponseMessage>(params);

export const updateTaskStatusService = (
  params: UpdateTaskStatusRequestMessage
) => adapter.postMessage<UpdateTaskStatusResponseMessage>(params);

export const updateTaskService = (params: UpdateTaskRequestMessage) =>
  adapter.postMessage<UpdateTaskResponseMessage>(params);

export const deleteTaskService = (params: DeleteTaskRequestMessage) =>
  adapter.postMessage<DeleteTaskResponseMessage>(params);

export const updateKanbanDeveloperService = (
  params: UpdateKanbanDeveloperRequestMessage
) => adapter.postMessage<UpdateKanbanStatusResponseMessage>(params);

export const updateKanbanStatusService = (
  params: UpdateKanbanStatusRequestMessage
) => adapter.postMessage<UpdateKanbanStatusResponseMessage>(params);
