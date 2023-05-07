import { DashboardOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Space, theme } from "antd";
import React from "react";

const isVscode = !!window.acquireVsCodeApi;

const KanbanSwitch = () => {
  const { token } = theme.useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  if (isVscode) {
    return null;
  }

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: [{ label: "看板一", key: 1 }] }}
      dropdownRender={(menu) => {
        return (
          <div style={contentStyle}>
            {React.cloneElement(menu as React.ReactElement, {
              style: { boxShadow: "none" },
            })}
            <Divider style={{ margin: 0 }} />
            <Space style={{ padding: 4 }}>
              <Button type="text" icon={<PlusOutlined />}>
                新增看板
              </Button>
            </Space>
          </div>
        );
      }}
    >
      <Button type="text" icon={<DashboardOutlined />}>
        看板
      </Button>
    </Dropdown>
  );
};

export default KanbanSwitch;