import Moon from "@/icons/Moon";
import Sun from "@/icons/Sun";
import { useAlgorithm } from "@/state";
import { Button, theme } from "antd";
import { useMemo } from "react";

const KanbanSwitch = () => {
  const { algorithm, toggleAlgorithm } = useAlgorithm();

  const icon = useMemo(() => {
    if (algorithm === theme.darkAlgorithm) {
      return <Moon />;
    }
    return <Sun />;
  }, [algorithm]);

  return (
    <Button
      type="text"
      icon={icon}
      onClick={() => {
        toggleAlgorithm();
      }}
    />
  );
};

export default KanbanSwitch;
