import { useMount, useRequest } from "ahooks";
import { Space } from "antd";
import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Header from "./components/Header";
import TaskColumn from "./components/TaskColumn";
import { MessageData, TaskStatus } from "./constants";
import { useDeveloperList, useStatusList, useTaskList } from "./state";
import { useAddTask } from "./utils/hooks";
import { modifyTaskStatus } from "./utils/request";

function Main() {
  const { tasks, updateTasks } = useTaskList();
  const { status, updateStatus } = useStatusList();
  const { developer, updateDeveloper } = useDeveloperList();
  const handleAddTask = useAddTask();

  useMount(() => {
    const updater = {
      tasks: updateTasks,
      status: updateStatus,
      developer: updateDeveloper,
    };
    window.addEventListener("message", (e: MessageEvent<MessageData>) => {
      const message = e.data;
      switch (message.command) {
        case "setState":
          updater[message.key](message.payload);
          break;

        default:
          break;
      }
    });
  });

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
      const sourceList = tasks?.[source.droppableId as TaskStatus] || [];
      const destinationList =
        tasks?.[destination!.droppableId as TaskStatus] || [];

      const task = sourceList.splice(source.index, 1)[0];
      task.status = destination.droppableId as TaskStatus;
      destinationList.splice(destination?.index!, 0, task);
      updateTasks({
        ...(tasks || {}),
        [source.droppableId as TaskStatus]: sourceList,
        [destination?.droppableId as TaskStatus]: destinationList,
      } as typeof tasks);
      modifyTaskStatus({
        _id: draggableId,
        status: destination.droppableId as TaskStatus,
      });
    }
  };
  const handelExtra = (status: TaskStatus) => {
    if (status === TaskStatus.ToBeDeveloped) {
      handleAddTask();
    }
  };
  return (
    <>
      <Header />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Space className="task-container" size="middle">
          {status.map((column) => (
            <TaskColumn
              key={column.value}
              title={column.label}
              status={column.value}
              data={tasks?.[column.value]}
              handelExtra={handelExtra}
            />
          ))}
        </Space>
      </DragDropContext>
    </>
  );
}

export default Main;
