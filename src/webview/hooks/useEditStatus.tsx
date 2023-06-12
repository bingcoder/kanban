import {
  DragOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Form, Input, Popconfirm, Row } from "antd";
import { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { AddStatus } from "../../constants";
import { useStatus } from "../state";
import { uuid } from "../utils";
import { ConfigOption } from "../../constants";

export function useEditStatus() {
  const [form] = Form.useForm<{ status: ConfigOption[] }>();
  const { modal } = App.useApp();
  const { status, updateKanbanStatus } = useStatus();

  const handleEditStatus = useCallback(() => {
    form.setFieldsValue({
      status: status?.filter((item) => item.id !== AddStatus.id),
    });
    modal.confirm({
      icon: null,
      width: 500,
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
                                  wrap={false}
                                  className="status-draggable-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
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
                                        message: "请输入状态",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="状态" />
                                  </Form.Item>
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
        return updateKanbanStatus(values.status);
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
