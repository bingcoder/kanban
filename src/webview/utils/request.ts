// @ts-ignore
const vscode = acquireVsCodeApi();

import { StatusRecord, TaskRecord, TaskStatus } from "../constants";

export function getTasks() {
  vscode.postMessage({
    command: "getTasks",
  });
}

export function modifyTaskStatus(data: { _id: string; status: TaskStatus }) {
  vscode.postMessage({
    command: "modifyTaskStatus",
    data,
  });
}

export function addTask(data: {
  status: TaskStatus;
  startTime: string;
  endTime: string;
  developer: number[];
}) {
  vscode.postMessage({
    command: "addTask",
    data,
  });
}

export function deleteTask(data: string) {
  vscode.postMessage({
    command: "deleteTask",
    data,
  });
}

export function updateTask(data: Partial<TaskRecord>) {
  vscode.postMessage({
    command: "deleteTask",
    data,
  });
}

// export function getOptions(key: ConfigKey) {
//   if (key === "status") return config[key].findAsync({}).sort({ value: 1 });
//   return config[key].findAsync({});
// }

// export function addOption(key: ConfigKey, option: ConfigOption) {
//   return config[key].insertAsync(option);
// }

// export function removeOption(key: ConfigKey, _id: string) {
//   return config[key].removeAsync({ _id }, { multi: false });
// }

// export function updateOption(
//   key: ConfigKey,
//   { _id, ...option }: Partial<ConfigOption> & { _id: string }
// ) {
//   return config[key].updateAsync({ _id }, { $set: option });
// }
