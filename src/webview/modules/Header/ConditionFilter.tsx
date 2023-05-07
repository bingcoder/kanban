import {
  SearchCondition,
  useDeveloper,
  useSearchCondition,
  useTask,
} from "@/state";
import {
  CalendarOutlined,
  FilterOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  DatePicker,
  Form,
  FormProps,
  Popover,
  Row,
  Select,
  Space,
  Typography,
  theme,
} from "antd";
import { useEffect, useMemo } from "react";

const SearchSwitch = () => {
  const { developer } = useDeveloper();
  const { getTasks } = useTask();
  const { condition, updateSearchCondition } = useSearchCondition();
  const { token } = theme.useToken();

  useEffect(() => {
    getTasks();
  }, [condition]);

  const handleValuesChange: FormProps["onValuesChange"] = (
    _,
    { developer, developEndAt }
  ) => {
    const params: SearchCondition = {
      developer: developer?.length ? developer : undefined,
      developEndAt: developEndAt?.length
        ? [
            developEndAt[0].format("YYYY-MM-DD"),
            developEndAt[1].format("YYYY-MM-DD"),
          ]
        : undefined,
    };

    updateSearchCondition(params);
  };

  const count = useMemo(() => {
    console.log(condition);

    return (
      Object.values(condition).filter((item) => item != null).length -
      (condition.title != null ? 1 : 0)
    );
  }, [condition]);

  return (
    <Popover
      trigger={["click"]}
      arrow={false}
      placement="bottomRight"
      overlayInnerStyle={{ paddingTop: 18 }}
      content={
        <Form onValuesChange={handleValuesChange}>
          <Space direction="vertical">
            <Row>
              <Space>
                <Button style={{ backgroundColor: "transparent" }} type="text">
                  满足
                </Button>
                <Button
                  style={{ backgroundColor: token.colorBgTextHover }}
                  type="text"
                  icon={<TeamOutlined />}
                >
                  开发人员
                </Button>
                <Button
                  style={{ backgroundColor: token.colorBgTextHover }}
                  type="text"
                >
                  是
                </Button>
                <Form.Item noStyle name="developer">
                  <Select
                    onClick={(e) => e.stopPropagation()}
                    fieldNames={{ value: "id" }}
                    placeholder="添加开发者"
                    mode="multiple"
                    options={developer}
                    style={{ width: 300 }}
                    allowClear
                  />
                </Form.Item>
              </Space>
            </Row>
            <Row>
              <Space>
                <Button
                  style={{ backgroundColor: token.colorBgTextHover }}
                  type="text"
                >
                  &emsp;且
                </Button>
                <Button
                  style={{ backgroundColor: token.colorBgTextHover }}
                  type="text"
                  icon={<CalendarOutlined />}
                >
                  截止时间
                </Button>
                <Button
                  style={{ backgroundColor: token.colorBgTextHover }}
                  type="text"
                >
                  是
                </Button>
                <Form.Item noStyle name="developEndAt">
                  <DatePicker.RangePicker style={{ width: 300 }} />
                </Form.Item>
              </Space>
            </Row>
            <Row justify="end">
              <Button type="link">保存为条件</Button>
            </Row>
          </Space>
        </Form>
      }
    >
      <Badge count={count} size="small" offset={[-8, 6]}>
        <Button type="text" icon={<FilterOutlined />}>
          筛选
        </Button>
      </Badge>
    </Popover>
  );
};

export default SearchSwitch;
