import { useKanban } from "@/state";
import { useMount } from "ahooks";

const useInit = () => {
  const { getKanban } = useKanban();
  useMount(() => {
    getKanban();
  });
};

export default useInit;
