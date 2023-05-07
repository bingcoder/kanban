import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space } from "antd";
import ConditionFilter from "./ConditionFilter";
import DateFilter from "./DateFilter";
import KanbanSwitch from "./KanbanSwitch";
import SearchSwitch from "./SearchSwitch";
import ThemeSwitch from "./ThemeSwitch";
import TitleFilter from "./TitleFilter";
import ExtraSetting from "./ExtraSetting";

const Header = () => {
  return (
    <Row className="task-app-header" wrap={false} justify="space-between">
      <Space>
        <KanbanSwitch />
        <SearchSwitch />
      </Space>
      <Col>
        <Space>
          <TitleFilter />
          <DateFilter />
          <ConditionFilter />
          <ThemeSwitch />
          <ExtraSetting />
        </Space>
      </Col>
    </Row>
  );
};

export default Header;
