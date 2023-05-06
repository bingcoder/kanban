import { App, Form } from "antd";
import { useCallback } from "react";
import ModifyForm, { TaskFormValues } from "../components/Modify";
import { useTask } from "../state";
import { fakeResolve, formatDevelopDateValues } from "../utils";

export function useAddTask(status: string) {
  const [form] = Form.useForm<TaskFormValues>();
  const { modal } = App.useApp();
  const { addTask } = useTask();

  const handleAddTask = useCallback(() => {
    form.setFieldsValue({
      status,
    });
    modal.confirm({
      title: "新增任务",
      content: <ModifyForm form={form} />,
      async onOk() {
        const { title, status, developDate, developer, progress } =
          await form.validateFields();

        addTask({
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
  return handleAddTask;
}
