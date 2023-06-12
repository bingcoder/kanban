import { useTask } from "@/state";
import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Refresher = () => {
  const refreshTasks = useTask((s) => s.refreshTasks);

  return (
    <Button
      type="text"
      icon={<ReloadOutlined />}
      onClick={() => {
        refreshTasks();
      }}
    />
  );
};

export default Refresher;
