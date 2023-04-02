import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import classNames from "classnames";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";

import dayjs from "dayjs";

import {
  getTaskByStatus,
  db,
  getTasks,
  modifyTaskStatus,
  insetTask,
  insertTask,
} from "./utils/request";
import { columns, TaskRecord, TaskStatus } from "./constants";
import { useRequest } from "ahooks";
import { ExclamationCircleFilled, TrophyTwoTone } from "@ant-design/icons";
import TaskColumn from "./components/TaskColumn";
import ModifyForm from "./components/Modify";
import { formatValues } from "./utils/formatValus";

function Main() {
  const { modal, message } = App.useApp();
  const { data, loading, mutate, runAsync: getTasksRun } = useRequest(getTasks);
  const { runAsync } = useRequest(insertTask, { manual: true });
  const handleDragEnd = (result: DropResult) => {
    if (result) {
      const { draggableId, source, destination } = result;
      if (
        !destination ||
        result.reason === "CANCEL" ||
        (source.droppableId === destination.droppableId &&
          source.index === destination.index)
      ) {
        return;
      }
      const sourceList = data?.[source.droppableId as TaskStatus] || [];
      const destinationList =
        data?.[destination!.droppableId as TaskStatus] || [];

      const task = sourceList.splice(source.index, 1);
      destinationList.splice(destination?.index!, 0, task[0]);
      mutate({
        ...(data || {}),
        [source.droppableId as TaskStatus]: sourceList,
        [destination?.droppableId as TaskStatus]: destinationList,
      } as typeof data);

      modifyTaskStatus({
        _id: draggableId,
        status: destination.droppableId as TaskStatus,
      });
    }
  };
  const [form] = Form.useForm();
  const handelExtra = (status: TaskStatus) => {
    if (status === TaskStatus.ToBeDeveloped) {
      modal.confirm({
        title: "添加任务",
        content: <ModifyForm form={form} />,
        async onOk() {
          const values = await form.validateFields();
          return runAsync({
            status: TaskStatus.ToBeDeveloped,
            ...formatValues(values),
          }).then(() => {
            message.success("添加成功");
            form.resetFields();
            getTasksRun();
          });
        },
      });
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Space className="task-container" size="middle">
        {columns.map((column) => (
          <TaskColumn
            key={column.status}
            {...column}
            data={data?.[column.status]}
            handelExtra={handelExtra}
            getTasks={getTasksRun}
          />
        ))}
      </Space>
    </DragDropContext>
  );
}

export default Main;
