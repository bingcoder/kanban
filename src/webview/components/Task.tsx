import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Dropdown,
  MenuProps,
  Popconfirm,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  BorderOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { useMemo } from "react";
import { useBoolean } from "ahooks";
import { useDeveloper, useStatus } from "../state";
import { RangePickerProps } from "antd/es/date-picker";
import { TaskRecord } from "../../constants";
import { useEditStatus, useEditTask } from "../hooks";

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
            onConfirm={
              () => {}
              // deleteTask(task._id).then(() => {
              //   getTasks();
              // })
            }
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
    // updateTask({ _id: task._id, status: info.key }).then(() => {
    //   getTasks();
    // });
  };

  const handelTaskDateChange: RangePickerProps["onChange"] = (date) => {
    // updateTask({ _id: task._id, ...formatValues({ date }) }).then(() => {
    //   notification.success({ message: "修改成功" });
    // });
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <div
            className="task-card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => handleEditTask(task)}
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
            <Row style={{ marginBottom: 10 }}>
              <Space>
                <Tag
                  color="processing"
                  // danger={dayjs(task.endTime).isBefore(dayjs())}
                >
                  {task.developStartAt} ~ {task.developEndAt}
                </Tag>
              </Space>
              <Col onClick={(e) => e.stopPropagation()}></Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Space align="center">
                  <Avatar.Group size="small" style={{ marginTop: 4 }}>
                    {developer?.map((item) => (
                      <Avatar key={item.id}>{item.label}</Avatar>
                    ))}
                  </Avatar.Group>

                  <Progress
                    type="circle"
                    percent={task.progress}
                    size={26}
                    // format={(f) => f}
                  />
                </Space>
              </Col>
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
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
