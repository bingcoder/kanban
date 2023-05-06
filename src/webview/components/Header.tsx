import { Button, Col, Divider, Input, Row, Space } from "antd";
import {
  AlignRightOutlined,
  BarsOutlined,
  EllipsisOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Header = () => {
  return (
    <header className="task-app-header">
      <Row wrap={false} justify="space-between">
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
      <Divider style={{ margin: "10px 0 0" }} />
    </header>
  );
};

export default Header;
