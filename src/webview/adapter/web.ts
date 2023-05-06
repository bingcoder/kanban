import NeDb from "@seald-io/nedb";

import {
  GetTasksRequestMessage,
  MessagePayload,
  UpdateStatusMessage,
} from "../../constants";

const kanbanDb = new NeDb({
  filename: "db/kanban.db",
  autoload: true,
  timestampData: true,
});

const taskDb = new NeDb({
  filename: "db/task.db",
  autoload: true,
  timestampData: true,
});

export const adapterForWeb = ({ set }: any) => {
  return {
    async updateStatus({ _id, status }: MessagePayload<UpdateStatusMessage>) {
      await kanbanDb.updateAsync({ _id }, { $set: { status } });
      const kanban = await kanbanDb.findOneAsync({ _id });
      set(kanban);
    },
    // async getTasks(payload: MessagePayload<GetTasksRequestMessage>) {
    //   await kanbanDb.updateAsync({ _id }, { $set: { status } });
    //   const kanban = await kanbanDb.findOneAsync({ _id });
    //   set(kanban);
    // },
  };
};
