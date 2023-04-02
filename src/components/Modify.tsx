import { DatePicker, Form, FormInstance, Input, Select } from "antd";
import React from "react";

const options = [
  {
    label: "刘健",
    value: "1",
  },
  {
    label: "德路",
    value: "2",
  },
  {
    label: "王洁",
    value: "3",
  },
];

const ModifyForm: React.FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <Form form={form}>
      <Form.Item label={<>&emsp;&emsp;标题</>} name="title">
        <Input placeholder="请输入标题" bordered={false} />
      </Form.Item>
      <Form.Item label={<>&emsp;&emsp;日期</>} name="date">
        <DatePicker.RangePicker bordered={false} />
      </Form.Item>
      <Form.Item label="开发人员" name="developer">
        <Select
          mode="multiple"
          placeholder="请选择开发人员"
          bordered={false}
          showArrow={false}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};

export default ModifyForm;
