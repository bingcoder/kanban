import { DatePicker, Form, FormInstance, Input, Select, Slider } from "antd";
import React from "react";
import { useDeveloperList, useStatusList } from "../state";

const ModifyForm: React.FC<{ form: FormInstance }> = ({ form }) => {
  const { developer } = useDeveloperList();
  const { status } = useStatusList();
  return (
    <Form form={form}>
      <Form.Item label="标题" name="title">
        <Input.TextArea
          placeholder="请输入标题"
          bordered={false}
          autoSize
          showCount
          maxLength={50}
        />
      </Form.Item>
      <Form.Item label="状态" name="status">
        <Select
          placeholder="请选择任务状态"
          bordered={false}
          showArrow={false}
          options={status}
        />
      </Form.Item>
      <Form.Item label="日期" name="date">
        <DatePicker.RangePicker bordered={false} />
      </Form.Item>
      <Form.Item label="人员" name="developer">
        <Select
          mode="multiple"
          placeholder="请选择开发人员"
          bordered={false}
          showArrow={false}
          options={developer}
        />
      </Form.Item>
      <Form.Item label="进度" name="progress">
        <Slider step={10} />
      </Form.Item>
    </Form>
  );
};

export default ModifyForm;
