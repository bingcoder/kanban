import { App, Form } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { TaskRecord } from "../../constants";
import ModifyForm, { TaskFormValues } from "../components/Modify";
import { useTask } from "../state";
import { fakeResolve, formatDevelopDateValues } from "../utils";

export function useEditTask() {
  const [form] = Form.useForm<TaskFormValues>();
  const { modal } = App.useApp();
  const { updateTask } = useTask();

  const handleEditTask = useCallback((task: TaskRecord) => {
    form.setFieldsValue({
      title: task.title,
      status: task.status,
      progress: task.progress,
      developDate: [dayjs(task.developStartAt), dayjs(task.developEndAt)],
      developer: task.developer,
    });
    modal.confirm({
      title: "修改任务",
      content: <ModifyForm form={form} />,
      async onOk() {
        const { title, status, developDate, developer, progress } =
          await form.validateFields();

        updateTask({
          ...task,
          title,
          status,
          ...formatDevelopDateValues(developDate),
          developer,
          progress,
        });
        return fakeResolve();
      },
    });
  }, []);
  return handleEditTask;
}