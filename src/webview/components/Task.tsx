import {
  BorderOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
  FieldTimeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  MenuProps,
  Popconfirm,
  Progress,
  Row,
  Space,
  Typography,
} from "antd";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

import { useBoolean } from "ahooks";
import { useMemo } from "react";
import { TaskRecord } from "../../constants";
import { useEditTask } from "../hooks";
import { useDeveloper, useStatus, useTask } from "../state";

const { Text } = Typography;

const TaskSelector: React.FC<{
  onClick: MenuProps["onClick"];
  items: MenuProps["items"];
  status: string;
}> = ({ onClick, items, status }) => {
  const [isHover, { setTrue, setFalse }] = useBoolean(false);
  return (
    <Dropdown
      trigger={["click"]}
      menu={{ selectedKeys: [status], items, onClick }}
    >
      <Button
        size="small"
        type="text"
        onMouseEnter={setTrue}
        onMouseLeave={setFalse}
        icon={isHover ? <CaretDownOutlined /> : <BorderOutlined />}
        className="task-status-selector"
      />
    </Dropdown>
  );
};

enum TaskAction {
  Modify = 1,
  Delete,
}

const Task: React.FC<
  React.PropsWithChildren<{
    task: TaskRecord;
    index: number;
  }>
> = (props) => {
  const { task, index } = props;
  const { status } = useStatus();
  const { developer: developerList } = useDeveloper();
  const handleEditTask = useEditTask();
  const { updateTask, deleteTask } = useTask();

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: TaskAction.Modify,
        label: <span onClick={() => handleEditTask(task)}>编辑</span>,
      },
      {
        key: TaskAction.Delete,
        label: (
          <Popconfirm
            arrow={false}
            onConfirm={() => deleteTask(task._id)}
            title="确认删除"
          >
            删除
          </Popconfirm>
        ),
        danger: true,
      },
    ];
  }, [task]);

  const statusItems: MenuProps["items"] = useMemo(() => {
    return status.map((item) => ({
      key: item.id,
      label: item.label,
    }));
  }, [status]);

  const developer = useMemo(() => {
    return developerList.filter((item) => task?.developer?.includes(item.id));
  }, [developerList, task?.developer]);

  const handleChangeStatus: MenuProps["onClick"] = (info) => {
    if (info.key === task.status) {
      return;
    }

    updateTask({
      _id: task._id,
      status: info.key,
    });
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <Card
            className="task-card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => handleEditTask(task)}
            bodyStyle={{ padding: 16 }}
          >
            <Row gutter={10} wrap={false} onClick={(e) => e.stopPropagation()}>
              <Col>
                <TaskSelector
                  status={task.status}
                  items={statusItems}
                  onClick={handleChangeStatus}
                />
              </Col>
              <Col>
                <Typography.Title
                  className="task-card-title"
                  level={5}
                  ellipsis={{ rows: 2 }}
                >
                  {task.title}
                </Typography.Title>
              </Col>
            </Row>
            <Row style={{ marginLeft: 32, marginBottom: 4 }}>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">
                  {task.developStartAt} - {task.developEndAt}
                </Text>
              </Space>
            </Row>
            <Row style={{ marginLeft: 32 }}>
              <Space>
                <TeamOutlined />
                <Text>{developer?.map((item) => item.label).join("、")}</Text>
              </Space>
            </Row>
            <Row style={{ marginLeft: 32 }} justify="space-between">
              <Space>
                <FieldTimeOutlined />
                <Progress
                  size={[16, 6]}
                  steps={5}
                  style={{ marginBottom: 6 }}
                  percent={task.progress}
                />
              </Space>
              <Col onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  placement="bottomLeft"
                  trigger={["click"]}
                  menu={{ items }}
                >
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>
              </Col>
            </Row>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default Task;
