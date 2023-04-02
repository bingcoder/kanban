import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { TaskRecord } from "../constants";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  MenuProps,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { EllipsisOutlined, TrophyTwoTone } from "@ant-design/icons";

import dayjs from "dayjs";
import { useMemo } from "react";
import { useRequest } from "ahooks";
import { removeTask } from "../utils/request";

enum TaskAction {
  Modify = 1,
  Delete,
}

const Task: React.FC<
  React.PropsWithChildren<{
    task: TaskRecord;
    index: number;
    getTasks: () => Promise<any>;
  }>
> = (props) => {
  const { task, index, getTasks } = props;
  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: TaskAction.Modify,
        label: "编辑",
      },
      {
        key: TaskAction.Delete,
        label: (
          <Popconfirm
            arrow={false}
            onConfirm={() =>
              removeTask(task._id).then(() => {
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
  }, [task._id]);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <div
            className="task-card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card>
              <Card.Meta
                title={
                  <Typography.Link
                    href="https://www.tapd.cn/31266984/prong/stories/view/1131266984001077721"
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Typography.Title level={5} ellipsis={{ rows: 2 }}>
                      <TrophyTwoTone style={{ marginRight: 6 }} />
                      {task.title}
                    </Typography.Title>
                  </Typography.Link>
                }
                // description={task.description}
              />
              <Row style={{ marginBottom: 10 }}>
                <DatePicker.RangePicker
                  size="small"
                  value={[
                    dayjs(task.startTime, "YYYY-MM-DD"),
                    dayjs(task.endTime, "YYYY-MM-DD"),
                  ]}
                  bordered={false}
                  allowClear={false}
                  suffixIcon={null}
                />
              </Row>
              <Row justify="space-between">
                <Col>
                  <Avatar.Group size="small">
                    <Avatar>的路</Avatar>
                    <Avatar>刘健</Avatar>
                  </Avatar.Group>
                </Col>
                <Col>
                  <Dropdown placement="bottomLeft" menu={{ items }}>
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </Dropdown>
                </Col>
              </Row>
            </Card>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
