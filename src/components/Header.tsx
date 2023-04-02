import { Button, Col, Form, Input, Modal, Row, Space, Typography } from "antd";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import classNames from "classnames";
import { TaskRecord, TaskStatus } from "../constants";
import Task from "./Task";
import {
  AlignRightOutlined,
  BarsOutlined,
  EllipsisOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Header = () => {
  return (
    <Row justify="space-between" className="task-app-header">
      <Col>
        <Button type="text" icon={<AlignRightOutlined />}>
          全部任务
        </Button>
      </Col>
      <Col>
        <Space>
          <Input
            size="small"
            placeholder="搜索标题"
            prefix={<SearchOutlined />}
          />
          <Button type="text" icon={<BarsOutlined />}>
            按照创建时间
          </Button>
          <Button type="text" icon={<FilterOutlined />}>
            筛选
          </Button>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Space>
      </Col>
    </Row>
  );
};

export default Header;
