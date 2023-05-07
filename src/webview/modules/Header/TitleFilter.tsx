import { useSearchCondition } from "@/state";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useMemo } from "react";

const SearchFilter = () => {
  const { updateSearchCondition } = useSearchCondition();

  const handleChange = useMemo(() => {
    let time: any;
    return (e: any) => {
      if (time) {
        clearTimeout(time);
      }
      time = setTimeout(() => {
        const value = e.target.value.trim();
        updateSearchCondition({ title: value });
      }, 500);
    };
  }, []);
  return (
    <Input
      allowClear
      size="small"
      placeholder="搜索标题"
      prefix={<SearchOutlined />}
      onChange={handleChange}
    />
  );
};

export default SearchFilter;
