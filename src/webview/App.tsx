import { useMount } from "ahooks";
import { Space } from "antd";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Header from "./components/Header";
import TaskColumn from "./components/TaskColumn";
import { useKanban, useStatus, useTask } from "./state";
import { modifyTaskStatus } from "./utils/request";
import "./App.less";
import { WebviewReceiveMessage } from "../constants";

function Main() {
  const { tasks, updateTasks, updateTask, getTasks } = useTask();
  const { statusColumns } = useStatus();

  console.log(tasks);

  const { updateKanban } = useKanban();

  useMount(() => {
    getTasks();
    window.addEventListener(
      "message",
      (e: MessageEvent<WebviewReceiveMessage>) => {
        const message = e.data;
        switch (message.command) {
          case "updateKanban":
            updateKanban(message.payload);
            break;
          case "updateTasks":
            updateTasks(message.payload);
            break;

          default:
            break;
        }
      }
    );
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
      const sourceList = tasks?.[source.droppableId] || [];
      const destinationList = tasks?.[destination!.droppableId] || [];

      const task = sourceList.splice(source.index, 1)[0];
      task.status = destination.droppableId;
      destinationList.splice(destination?.index!, 0, task);
      updateTasks({
        ...(tasks || {}),
        [source.droppableId]: sourceList,
        [destination?.droppableId]: destinationList,
      } as typeof tasks);
      updateTask({
        _id: draggableId,
        status: destination.droppableId,
      });
    }
  };

  return (
    <>
      <Header />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Space className="task-container" size="middle">
          {statusColumns.map((column) => (
            <TaskColumn
              key={column.id}
              title={column.label}
              status={column.id}
              data={tasks?.[column.id]}
            />
          ))}
        </Space>
      </DragDropContext>
    </>
  );
}

export default Main;
