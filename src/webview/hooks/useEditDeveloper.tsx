import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Col, Form, Input, Row } from "antd";
import { useCallback } from "react";
import { useDeveloper, useTask } from "../state";
import { fakeResolve, uuid } from "../utils";

export function useEditDeveloper() {
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const { developer } = useDeveloper();

  const handleEditDeveloper = useCallback(() => {
    form.setFieldsValue({
      developer,
    });
    modal.confirm({
      title: "修改开发人员",
      icon: null,
      content: (
        <Form form={form} style={{ marginTop: 16 }}>
          <Form.List name="developer">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name }) => {
                  return (
                    <Row key={key} wrap={false}>
                      <Form.Item
                        name={[name, "id"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入ID",
                          },
                        ]}
                      >
                        <Input placeholder="ID" />
                      </Form.Item>
                      <Form.Item>&emsp;-&emsp;</Form.Item>
                      <Form.Item
                        name={[name, "label"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入成员",
                          },
                        ]}
                      >
                        <Input placeholder="成员" />
                      </Form.Item>

                      <Button
                        style={{ marginLeft: 6 }}
                        type="link"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Row>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ id: uuid() })}
                    icon={<PlusOutlined />}
                  >
                    添加成员
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      ),
      async onOk() {
        const { developer } = await form.validateFields();
        console.log(developer);
        return Promise.reject();

        // updateTask({
        //   ...task,
        //   title,
        //   status,
        //   ...formatDevelopDateValues(developDate),
        //   developer,
        //   progress,
        // });
        return fakeResolve();
      },
    });
  }, [developer]);
  return handleEditDeveloper;
}
