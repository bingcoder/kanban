import { DatePicker, Form, FormInstance, Input, Select, Slider } from "antd";
import React from "react";
import { useDeveloper, useStatus } from "../state";
import { Dayjs } from "dayjs";

export interface TaskFormValues {
  title: string;
  status: string;
  developDate: [Dayjs, Dayjs];
  developer: string[];
  progress: number;
}

const ModifyForm: React.FC<{ form: FormInstance<TaskFormValues> }> = ({
  form,
}) => {
  const { developer } = useDeveloper();
  const { status } = useStatus();

  return (
    <Form
      form={form}
      requiredMark={false}
      validateMessages={{ required: "'${label}' 是必选字段!" }}
    >
      <Form.Item label="标题" name="title" rules={[{ required: true }]}>
        <Input.TextArea
          placeholder="请输入标题"
          bordered={false}
          autoSize
          showCount
          maxLength={50}
        />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]}>
        <Select
          placeholder="请选择任务状态"
          bordered={false}
          showArrow={false}
          options={status}
          fieldNames={{ value: "id" }}
        />
      </Form.Item>
      <Form.Item label="日期" name="developDate" rules={[{ required: true }]}>
        <DatePicker.RangePicker bordered={false} />
      </Form.Item>
      <Form.Item label="人员" name="developer" rules={[{ required: true }]}>
        <Select
          mode="multiple"
          placeholder="请选择开发人员"
          bordered={false}
          showArrow={false}
          options={developer}
          fieldNames={{ value: "id" }}
        />
      </Form.Item>
      <Form.Item label="进度" name="progress">
        <Slider step={20} />
      </Form.Item>
    </Form>
  );
};

export default ModifyForm;
