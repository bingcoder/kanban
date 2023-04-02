import Nedb from "@seald-io/nedb";

export const db = new Nedb({ filename: "abc.db", autoload: true });
//@ts-ignore
window.dbb = db;

import { TaskRecord, TaskStatus } from "../constants";

export function getTaskByStatus(status: TaskStatus) {
  return db.findAsync<TaskRecord>({ status });
}

export function getTasks() {
  return db
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
  return db.updateAsync({ _id }, { $set: { status } });
}

export function insertTask(params: {
  status: TaskStatus;
  startTime: string;
  endTime: string;
  developer: number[];
}) {
  return db.insertAsync(params);
}

export function removeTask(_id: string) {
  return db.removeAsync({ _id }, { multi: false });
}
