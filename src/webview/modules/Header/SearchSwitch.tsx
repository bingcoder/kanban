import {
  AlignRightOutlined,
  DashboardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Divider, Dropdown, Space, theme } from "antd";
import React from "react";

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
