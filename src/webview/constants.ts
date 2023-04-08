export enum TaskStatus {
  ToBeDeveloped = "1",
  UnderDevelopment = "2",
  DevelopmentCompleted = "3",
  ToBeTested = "4",
  UnderTest = "5",
  Completed = "6",
}

export const columns = [
  {
    title: "待开发",
    status: TaskStatus.ToBeDeveloped,
  },
  {
    title: "开发中",
    status: TaskStatus.UnderDevelopment,
  },
  {
    title: "开发完成",
    status: TaskStatus.DevelopmentCompleted,
  },
  // {
  //   title: "已提测",
  //   status: TaskStatus.ToBeTested,
  // },
  // {
  //   title: "测试中",
  //   status: TaskStatus.UnderTest,
  // },
  // {
  //   title: "已完成",
  //   status: TaskStatus.Completed,
  // },
] as const;

export interface TaskRecord {
  _id: string;
  status: TaskStatus;
  title: string;
  startTime: string;
  endTime: string;
  developer: string[];
  progress: number;
}

export interface StatusRecord {
  _id: string;
  label: string;
  status: TaskStatus;
}

export interface ConfigOption {
  label: string;
  value: string;
}

export interface SetTasksMessage {
  command: "setTasks";
  data: TaskRecord[];
}

export interface SetStateMessage {
  command: "setState";
  key: "tasks";
  payload: any;
}

export type MessageData = SetStateMessage;
