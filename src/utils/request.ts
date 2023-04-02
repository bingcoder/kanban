import Nedb from "@seald-io/nedb";

export const taskDb = new Nedb({ filename: "abc.db", autoload: true });
// export const statusDb = new Nedb({ filename: "status.db", autoload: true });
// export const configDb = new Nedb({ filename: "config.db", autoload: true });

export const config = {
  developer: new Nedb<ConfigOption>({
    filename: "developer.db",
    autoload: true,
  }),
  status: new Nedb<ConfigOption>({
    filename: "status.db",
    autoload: true,
  }),
};

export interface ConfigOption {
  label: string;
  value: string;
}
export type ConfigKey = keyof typeof config;

//@ts-ignore
window.db = taskDb;
//@ts-ignore
window.config = config;

import { StatusRecord, TaskRecord, TaskStatus } from "../constants";

export function getTaskByStatus(status: TaskStatus) {
  return taskDb.findAsync<TaskRecord>({ status });
}

export function getTasks() {
  return taskDb
    .findAsync<TaskRecord>({})
    .sort({ startTime: -1 })
    .then((res) => {
      const task: any = {};

      res.forEach((item) => {
        if (task[item.status]) {
          task[item.status].push(item);
        } else {
          task[item.status] = [item];
        }
      });
      return task as Record<TaskStatus, Array<TaskRecord>>;
    });
}

export function modifyTaskStatus({
  _id,
  status,
}: {
  _id: string;
  status: TaskStatus;
}) {
  return taskDb.updateAsync({ _id }, { $set: { status } });
}

export function addTask(params: {
  status: TaskStatus;
  startTime: string;
  endTime: string;
  developer: number[];
}) {
  return taskDb.insertAsync(params);
}

export function deleteTask(_id: string) {
  return taskDb.removeAsync({ _id }, { multi: false });
}

export function updateTask({ _id, ...restTask }: Partial<TaskRecord>) {
  return taskDb.updateAsync({ _id }, { $set: restTask });
}

// export function getStatus() {
//   return statusDb.findAsync<StatusRecord>({}).sort({ status: 1 });
// }

// export function addStatus(params: { label: string }) {
//   return statusDb.insertAsync(params);
// }

export function getOptions(key: ConfigKey) {
  if (key === "status") return config[key].findAsync({}).sort({ value: 1 });
  return config[key].findAsync({});
}

export function addOption(key: ConfigKey, option: ConfigOption) {
  return config[key].insertAsync(option);
}

export function removeOption(key: ConfigKey, _id: string) {
  return config[key].removeAsync({ _id }, { multi: false });
}

export function updateOption(
  key: ConfigKey,
  { _id, ...option }: Partial<ConfigOption> & { _id: string }
) {
  return config[key].updateAsync({ _id }, { $set: option });
}
