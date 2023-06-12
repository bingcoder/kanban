import { Row, Space } from "antd";
import ConditionFilter from "./ConditionFilter";
import DateFilter from "./DateFilter";
import KanbanSwitch from "./KanbanSwitch";
import SearchSwitch from "./SearchSwitch";
import TitleFilter from "./TitleFilter";
import ThemeSwitch from "./ThemeSwitch";
import ExtraSetting from "./ExtraSetting";

const Header = () => {
  return (
    <Row className="task-app-header" wrap={false} justify="space-between">
      <Space>
        <KanbanSwitch />
        <SearchSwitch />
      </Space>
      <Space>
        <TitleFilter />
        <DateFilter />
        <ConditionFilter />
        <ThemeSwitch />
        <ExtraSetting />
      </Space>
    </Row>
  );
};

export default Header;
