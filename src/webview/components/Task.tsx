import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { TaskRecord, TaskStatus } from "../constants";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
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
  message,
  notification,
} from "antd";
import {
  BorderOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
  TrophyTwoTone,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { useMemo } from "react";
import { useBoolean } from "ahooks";
import { deleteTask, updateTask } from "../utils/request";
import { useDeveloperList, useStatusList, useTaskList } from "../state";
import { useUpdateTask } from "../utils/hooks";
import { RangePickerProps } from "antd/es/date-picker";
import { formatValues } from "../utils/formatValus";

const { RangePicker } = DatePicker;

const TaskSelector: React.FC<{
  onClick: MenuProps["onClick"];
  items: MenuProps["items"];
  status: TaskStatus;
}> = ({ onClick, items, status }) => {
  const [isHover, { setTrue, setFalse }] = useBoolean(false);
  return (
    <Dropdown menu={{ selectedKeys: [status], items, onClick }}>
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
  const statusList = useStatusList((state) => state.status);
  const developerList = useDeveloperList((s) => s.developer);
  const { getTasks } = useTaskList();
  const handleUpdateTask = useUpdateTask(task);

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: TaskAction.Modify,
        label: <span onClick={handleUpdateTask}>编辑</span>,
      },
      {
        key: TaskAction.Delete,
        label: (
          <Popconfirm
            arrow={false}
            onConfirm={() =>
              deleteTask(task._id).then(() => {
                getTasks();
              })
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
    return statusList.map((item) => ({
      key: item.value,
      label: item.label,
    }));
  }, [statusList]);

  const developer = useMemo(() => {
    return developerList.filter((item) =>
      task?.developer?.includes(item.value)
    );
  }, [developerList, task?.developer]);

  const handleChangeStatus: MenuProps["onClick"] = (info) => {
    if (info.key === task.status) return;
    updateTask({ _id: task._id, status: info.key as TaskStatus }).then(() => {
      getTasks();
    });
  };

  const handelTaskDateChange: RangePickerProps["onChange"] = (date) => {
    updateTask({ _id: task._id, ...formatValues({ date }) }).then(() => {
      notification.success({ message: "修改成功" });
    });
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
            onClick={handleUpdateTask}
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
                  {task.startTime} ~ {task.endTime}
                </Tag>
              </Space>
              <Col onClick={(e) => e.stopPropagation()}>
                {/* <RangePicker
                  style={{ width: 200 }}
                  size="small"
                  defaultValue={[dayjs(task.startTime), dayjs(task.endTime)]}
                  onChange={handelTaskDateChange}
                  bordered={false}
                  allowClear={false}
                  suffixIcon={null}
                /> */}
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Space align="center">
                  <Avatar.Group size="small" style={{ marginTop: 4 }}>
                    {developer?.map((item) => (
                      <Avatar key={item.value}>{item.label}</Avatar>
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
                <Dropdown placement="bottomLeft" menu={{ items }}>
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
