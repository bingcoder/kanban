import { Form, App, notification } from "antd";
import ModifyForm from "../components/Modify";
import { updateTask, addTask } from "./request";
import { TaskRecord, TaskStatus } from "../constants";
import { formatValues } from "./formatValus";
import { useCallback, useEffect } from "react";
import { useTaskList } from "../state";
import dayjs from "dayjs";

export function useAddTask() {
  const [form] = Form.useForm();
  const { modal, message } = App.useApp();
  const { getTasks } = useTaskList();

  const handleAddTask = useCallback(() => {
    form.setFieldsValue({
      status: TaskStatus.ToBeDeveloped,
    });
    modal.confirm({
      title: "新增任务",
      content: <ModifyForm form={form} />,
      async onOk() {
        const values = await form.validateFields();
        return addTask(formatValues(values)).then(() => {
          notification.success({ message: "新增成功" });
          form.resetFields();
          getTasks();
        });
      },
    });
  }, []);
  return handleAddTask;
}

export function useUpdateTask(task: TaskRecord) {
  const [form] = Form.useForm();
  const { modal, message } = App.useApp();
  const { getTasks } = useTaskList();

  const handleUpdateTask = useCallback(() => {
    form.setFieldsValue({
      title: task.title,
      status: task.status,
      progress: task.progress,
      date: [dayjs(task.startTime), dayjs(task.endTime)],
      developer: task.developer,
    });
    modal.confirm({
      title: "修改任务",
      content: <ModifyForm form={form} />,
      async onOk() {
        const values = await form.validateFields();
        console.log({
          _id: task._id,
          ...formatValues(values),
        });
        return updateTask({
          _id: task._id,
          ...formatValues(values),
        }).then(() => {
          notification.success({ message: "修改成功" });
          form.resetFields();
          getTasks();
        });
      },
    });
  }, [task]);
  return handleUpdateTask;
}
