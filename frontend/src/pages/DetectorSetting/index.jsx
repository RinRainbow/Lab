import React from 'react';
import { Button, Flex, Form, Input, Select, Space } from 'antd';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function DetectorSetting() {
    const [form] = Form.useForm();
    const onModelChange = (value) => {
        switch (value) {
            case 'detector1':
            form.setFieldsValue({
                modelname: 'Hi, detector1!',
            });
            break;
            case 'detector2':
            form.setFieldsValue({
                modelname: 'Hi, detector2!',
            });
            break;
            case 'MalwareExpert':
            form.setFieldsValue({
                modelname: 'Hi MalwareExpert!',
            });
            break;
            default:
        }
    };
    const onFinish = (values) => {
        console.log(values);
    };
    const onReset = () => {
        form.resetFields();
    };
    const onFill = () => {
        form.setFieldsValue({
            modelname: 'Hello world!',
            model: 'detector1',
        });
    };
    return (
        <div className="whiteBox shadow">
            <div className='setting area' style={{padding: '30px 30px 15px 30px'}}>
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{
                      maxWidth: 600,
                    }}
                >
                    <Form.Item
                        name="modelname"
                        label="Modelname"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="model"
                        label="Model"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Select
                        placeholder="Select a model"
                        onChange={onModelChange}
                        allowClear
                        >
                        <Option value="detector1">detector1</Option>
                        <Option value="detector2">detector2</Option>
                        <Option value="MalwareExpert">MalwareExpert</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.model !== currentValues.model}
                    >
                        {({ getFieldValue }) =>
                        getFieldValue('model') === 'MalwareExpert' ? ([
                            <Form.Item
                            name="epoch"
                            label="Epoch"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>,
                            <Form.Item
                            name="learningRate"
                            label="Learning Rate"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>,
                            <Form.Item
                            name="batchSize"
                            label="Batch Size"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>,
                            <Form.Item
                            name="hiddenDim"
                            label="Hidden Dim"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input defaultValue="100"/>
                            </Form.Item>,
                            <Form.Item
                            name="shardCount"
                            label="Shard Count"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>,
                            <Form.Item
                            name="sliceCount"
                            label="Slice Count"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>,
                            <Form.Item
                            name="dropoutValue"
                            label="Dropout Value"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input defaultValue="0.5"/>
                            </Form.Item>,
                            <Form.Item
                            name="preprocessMethod"
                            label="Preprocess Method"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                        >
                            <Select
                            placeholder="Select a method"
                            // onChange={onModelChange}
                            allowClear
                            >
                            <Option value="asm2vec">asm2vec</Option>
                            <Option value="safe">SAFE</Option>
                            </Select>
                        </Form.Item>,
                        ]) : null
                        }
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                        <Button type="link" htmlType="button" onClick={onFill}>
                            Fill form
                        </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            <div className='button set' style={{padding: '15px 30px 30px 0px'}}>
                <Flex justify="flex-end" align='flex-end' gap="small" wrap>
                    <Button type="primary">Save</Button>
                </Flex>
            </div>
            
        </div>
    );
}