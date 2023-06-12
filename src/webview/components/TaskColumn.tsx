import { Button, Row, Typography } from "antd";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import classNames from "classnames";
import { AddStatus, TaskRecord } from "../../constants";
import Task from "./Task";
import { useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useAddTask, useEditStatus } from "../hooks";

const { Title, Text } = Typography;

const TaskColumn: React.FC<
  React.PropsWithChildren<{
    title: string;
    status: string;
    data?: Array<TaskRecord>;
  }>
> = (props) => {
  const { title, status, data = [] } = props;

  const handleEditStatus = useEditStatus();
  const handleAddTask = useAddTask(status);

  const header = useMemo(() => {
    if (status === AddStatus.id) {
      return (
        <Button type="text" icon={<PlusOutlined />} onClick={handleEditStatus}>
          添加状态
        </Button>
      );
    }
    return (
      <>
        <Title level={5}>
          {title}
          <Text type="secondary" style={{ marginLeft: 10 }}>
            {data?.length}
          </Text>
        </Title>
        <Button type="text" icon={<PlusOutlined />} onClick={handleAddTask} />
      </>
    );
  }, [status, title, data]);

  return (
    <Droppable droppableId={status}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div className="task-columns">
          <Row justify="space-between" className="task-columns-title">
            {header}
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
