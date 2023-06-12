import { AlignRightOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

const SearchSwitch = () => {
  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: [{ label: "全部任务", key: 1 }] }}
    >
      <Button type="text" icon={<AlignRightOutlined />}>
        全部任务
      </Button>
    </Dropdown>
  );
};

export default SearchSwitch;
