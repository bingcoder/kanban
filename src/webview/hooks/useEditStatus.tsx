import {
  DragOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Col, Form, Input, Popconfirm, Row } from "antd";
import { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { AddStatus } from "../../constants";
import { useKanban, useStatus } from "../state";
import { fakeResolve, uuid } from "../utils";
import { ConfigOption } from "../../constants";

export function useEditStatus() {
  const [form] = Form.useForm<{ status: ConfigOption[] }>();
  const { modal } = App.useApp();
  const { status, updateStatus } = useStatus();

  const handleEditStatus = useCallback(() => {
    form.setFieldsValue({
      status: status?.filter((item) => item.id !== AddStatus.id),
    });
    modal.confirm({
      title: "编辑状态",
      content: (
        <Form form={form}>
          <Form.List name="status">
            {(fields, { add, remove, move }, { errors }) => (
              <DragDropContext
                onDragEnd={(result) => {
                  const { source, destination } = result;
                  if (
                    !destination ||
                    result.reason === "CANCEL" ||
                    (source.droppableId === destination.droppableId &&
                      source.index === destination.index)
                  ) {
                    return;
                  }
                  move(source.index, destination.index);
                }}
              >
                <Droppable droppableId="1">
                  {(provided: DroppableProvided) => {
                    return (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {fields.map(({ key, name }, index) => {
                          return (
                            <Draggable
                              key={key}
                              draggableId={key.toString()}
                              index={index}
                            >
                              {(provided: DraggableProvided) => (
                                <Row
                                  className="status-draggable-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <Col flex={1}>
                                    <Form.Item
                                      name={[name, "label"]}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message: "请输入状态",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <Input placeholder="状态" />
                                    </Form.Item>
                                  </Col>
                                  <Col>
                                    <Button
                                      type="text"
                                      icon={<DragOutlined />}
                                      {...provided.dragHandleProps}
                                    />
                                    <Popconfirm
                                      title="删除状态(同时删除任务)"
                                      onConfirm={() => remove(name)}
                                    >
                                      <Button
                                        type="text"
                                        icon={<MinusCircleOutlined />}
                                      />
                                    </Popconfirm>
                                  </Col>
                                </Row>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add({ id: uuid() })}
                            icon={<PlusOutlined />}
                          >
                            添加状态
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
            )}
          </Form.List>
        </Form>
      ),
      async onOk() {
        const values = await form.validateFields();
        updateStatus(values.status);
        return fakeResolve();
      },
      onCancel() {
        setTimeout(() => {
          form.resetFields();
        }, 300);
      },
    });
  }, [status]);

  return handleEditStatus;
}
