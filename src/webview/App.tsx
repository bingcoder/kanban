import { App, theme } from "antd";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import "./App.less";
import TaskColumn from "./components/TaskColumn";
import Header from "./modules/Header";
import { useKanban, useStatus, useTask } from "./state";
import useInit from "./hooks/useInit";

function MainApp() {
  const { token } = theme.useToken();
  const { tasks, updateTasks, updateTask } = useTask();
  const { statusColumns } = useStatus();
  const activeKanban = useKanban((s) => s.activeKanban);
  useInit();
  const handleDragEnd = async (result: DropResult) => {
    if (result) {
      const { draggableId, source, destination } = result;
      if (
        !destination ||
        result.reason === "CANCEL" ||
        source.droppableId === destination.droppableId
      ) {
        return;
      }

      const sourceList = tasks?.[source.droppableId] || [];
      const destinationList = [...(tasks?.[destination!.droppableId] || [])];

      const task = sourceList.splice(source.index, 1)[0];
      task.status = destination.droppableId;
      destinationList.splice(destination?.index!, 0, task);

      updateTasks({
        ...(tasks || {}),
        [source.droppableId]: sourceList,
        [destination?.droppableId]: destinationList,
      } as typeof tasks);

      await updateTask({
        _id: draggableId,
        status: destination.droppableId,
      });
    }
  };

  if (!activeKanban) {
    return null;
  }

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
