import { Button, Form, Modal, Row, Typography } from "antd";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import classNames from "classnames";
import { TaskRecord, TaskStatus } from "../constants";
import Task from "./Task";

const TaskColumn: React.FC<
  React.PropsWithChildren<{
    title: string;
    status: TaskStatus;
    extra?: any;
    data?: Array<TaskRecord>;
    handelExtra?: (status: TaskStatus) => void;
    getTasks: () => Promise<any>;
  }>
> = (props) => {
  const { title, status, extra, data = [], handelExtra, getTasks } = props;

  return (
    <div className="task-columns">
      <Row justify="space-between" className="task-columns-title">
        <Typography.Title level={5}>{title}</Typography.Title>
        {extra && (
          <Button
            type="text"
            icon={extra}
            onClick={() => handelExtra?.(status)}
          />
        )}
      </Row>
      <Droppable droppableId={status}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className={classNames("task-droppable-container", {
              "task-droppable-container-dragging-over": snapshot.isDraggingOver,
            })}
            ref={provided.innerRef}
            {...provided.droppableProps}
            key={title}
          >
            {data.map((task, index: number) => {
              return (
                <Task
                  task={task}
                  index={index}
                  key={task._id}
                  getTasks={getTasks}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
