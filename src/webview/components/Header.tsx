import { Button, Col, Input, Row, Space } from "antd";
import {
  AlignRightOutlined,
  BarsOutlined,
  DashboardOutlined,
  EllipsisOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAlgorithm } from "@/state";

const Header = () => {
  const { toggleAlgorithm: toggleTheme } = useAlgorithm();
  return (
    <Row className="task-app-header" wrap={false} justify="space-between">
      <Space>
        <Button type="text" icon={<DashboardOutlined />}>
          看板
        </Button>
        <Button type="text" icon={<AlignRightOutlined />}>
          全部任务
        </Button>
      </Space>
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
          <Button
            type="text"
            icon={<EllipsisOutlined />}
            onClick={() => {
              toggleTheme();
            }}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default Header;
