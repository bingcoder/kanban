import { useMount } from "ahooks";
import { Space, App, theme } from "antd";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Header from "./modules/Header";
import TaskColumn from "./components/TaskColumn";
import { useKanban, useStatus, useTask } from "./state";
import "./App.less";
import { KanbanMessage, ResponseMessage } from "../constants";

function MainApp() {
  const { token } = theme.useToken();
  const { tasks, getTasks, updateTasks, updateTaskStatus } = useTask();
  const { statusColumns } = useStatus();
  const { kanban, updateKanban } = useKanban();

  console.log(tasks);

  useMount(() => {
    const handler = {
      refreshTasksResponse: updateTasks,
    };
    window.addEventListener("message", (e: MessageEvent<ResponseMessage>) => {
      const message = e.data;
      if (message?.source === KanbanMessage.source) {
        handler[message.command]?.(message.payload);
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
      updateTaskStatus({
        _id: draggableId,
        status: destination.droppableId,
      });
    }
  };

  return (
    <App style={{ backgroundColor: token.colorBgContainer }}>
      <Header />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="task-container"
          style={{ backgroundColor: token.colorBgLayout }}
        >
          {statusColumns.map((column) => (
            <TaskColumn
              key={column.id}
              title={column.label}
              status={column.id}
              data={tasks?.[column.id]}
            />
          ))}
        </div>
      </DragDropContext>
    </App>
  );
}

export default MainApp;
