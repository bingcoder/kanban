import { useEditDeveloper } from "@/hooks/useEditDeveloper";
import {
  EllipsisOutlined,
  SettingOutlined,
  ImportOutlined,
  ExportOutlined,
  TeamOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Row, Segmented } from "antd";

const SearchSwitch = () => {
  const handleEditDeveloper = useEditDeveloper();

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      menu={{
        items: [
          {
            icon: <ImportOutlined />,
            label: "导入",
            key: 1,
          },
          {
            icon: <ExportOutlined />,
            label: "导出",
            key: 2,
          },
          {
            type: "divider",
          },
          {
            icon: <TeamOutlined />,
            label: "成员管理",
            key: 3,
            onClick: handleEditDeveloper,
          },
          {
            icon: <ClusterOutlined />,
            label: "状态管理",
            key: 4,
          },
          {
            type: "divider",
          },
          {
            icon: <SettingOutlined />,
            label: "更多设置",
            key: 5,
          },
        ],
      }}
    >
      <Button type="text" icon={<EllipsisOutlined />} />
    </Dropdown>
  );
};

export default SearchSwitch;
