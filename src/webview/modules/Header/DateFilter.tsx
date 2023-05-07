import {
  AlignRightOutlined,
  BarsOutlined,
  DashboardOutlined,
  FilterOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Divider, Dropdown, Row, Segmented, Space, theme } from "antd";
import React from "react";

const SearchSwitch = () => {
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      menu={{
        items: [
          {
            label: (
              <Row justify="space-between" style={{ width: 250 }}>
                按创建日期
                <Segmented
                  style={{ fontSize: 12 }}
                  size="small"
                  options={[
                    { label: "早到晚", value: 1 },
                    { label: "晚到早", value: 0 },
                  ]}
                />
              </Row>
            ),
            key: 1,
          },
          {
            label: (
              <Row justify="space-between" style={{ width: 250 }}>
                按截止日期
                <Segmented
                  style={{ fontSize: 12 }}
                  size="small"
                  options={[
                    { label: "早到晚", value: 1 },
                    { label: "晚到早", value: 0 },
                  ]}
                />
              </Row>
            ),
            key: 2,
          },
        ],
      }}
    >
      <Button type="text" icon={<SortAscendingOutlined />}>
        按照创建时间
      </Button>
    </Dropdown>
  );
};

export default SearchSwitch;
