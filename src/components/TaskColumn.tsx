import { Button, Form, Modal, Row, Space, Typography } from "antd";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import classNames from "classnames";
import { TaskRecord, TaskStatus } from "../constants";
import Task from "./Task";
import { tasks } from "../tasks";
import { useTaskList } from "../state";
import { useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const extraMap: any = {
  [TaskStatus.ToBeDeveloped]: <PlusOutlined />,
};

const TaskColumn: React.FC<
  React.PropsWithChildren<{
    title: string;
    status: TaskStatus;
    data?: Array<TaskRecord>;
    handelExtra?: (status: TaskStatus) => void;
  }>
> = (props) => {
  const { title, status, data = [], handelExtra } = props;

  const extra = useMemo(() => {
    return extraMap[status];
  }, [status]);

  return (
    <Droppable droppableId={status}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div className="task-columns">
          <Row justify="space-between" className="task-columns-title">
            <Title level={5}>
              {title}{" "}
              <Text type="secondary" style={{ marginLeft: 10 }}>
                {data?.length}
              </Text>
            </Title>
            {extra && (
              <Button
                type="text"
                icon={extra}
                onClick={() => handelExtra?.(status)}
              />
            )}
          </Row>
          <div
            className={classNames("task-droppable-container", {
              "task-droppable-container-dragging-over": snapshot.isDraggingOver,
            })}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.map((task, index: number) => {
              return <Task task={task} index={index} key={task._id} />;
            })}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
