import React, { useState, useEffect } from 'react';
import { Button, Flex, Form, Input, Select, Space, message, InputNumber } from 'antd';
import { request } from '@/request';
import errorHandler from '@/request/errorHandler';
import { crud } from '@/redux/crud/actions';
import { useDispatch } from 'react-redux';

const { Option } = Select;

const asyncList = (entity) => {
    return request.list({ entity });
};

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
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await asyncList('datasetname');
                console.log('useEffect data: ', data);
                setOptions(data.result);
            } catch (error) {
                console.log('useEffect erorr!');
                errorHandler(error);
            }
        }
        fetchData();
    }, []);
    const onModelChange = (value) => {
        switch (value) {
            case 'MDOEL':
            form.setFieldsValue({
                modelName: 'Hi, MDOEL!',
            });
            break;
            case 'IMCFN':
            form.setFieldsValue({
                modelName: 'Hi, IMCFN!',
            });
            break;
            case 'MalwareExpert':
            form.setFieldsValue({
                modelName: 'Hi MalwareExpert!',
            });
            break;
            default:
        }
    };
    const onFinish = async (values) => {
        setLoading(true);
        console.log(values);
        try {
            const entity = 'modelsetting';
            // const requestData = values;
            const requestData = {
                ...values,
                rotation: [values.rotation1, values.rotation2],
                zoom: [values.zoom1, values.zoom2],
                shear: [values.shear1, values.shear2, values.shear3, values.shear4],
            };
            console.log('onFinish requestData: ', requestData);
            dispatch(crud.create({ entity, jsonData: requestData }));
        } catch(error) {
            console.log('onFinish error!');
            message.open({
            type: 'error',
            content: 'onFinish error!',
            });
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    };
    const onReset = () => {
        form.resetFields();
    };
    return (
        <div className="whiteBox shadow">
            <div className='setting area' style={{padding: '30px 30px 30px 30px'}}>
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    // disabled={loading}
                    style={{
                      maxWidth: 600,
                    }}
                >
                    <Form.Item
                        name="modelName"
                        label="Modelname"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Input allowClear/>
                    </Form.Item>
                    <br></br>
                    <Form.Item
                        name="datasetId"
                        label="Dataset"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Select
                        placeholder="Select a dataset"
                        allowClear
                        >
                            {Array.isArray(options) && options.length > 0 && options.map((option) => (
                                <Option key={option._id} value={option._id}>
                                {option.datasetName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <br></br>
                    <Form.Item
                        name="detector"
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
                        // allowClear
                        >
                        <Option value="MDOEL">MDOEL</Option>
                        <Option value="IMCFN">IMCFN</Option>
                        <Option value="MalwareExpert">MalwareExpert</Option>
                        </Select>
                    </Form.Item>
                    <br></br>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.detector !== currentValues.detector}
                    >
                        {({ getFieldValue }) =>
                        getFieldValue('detector') === 'MalwareExpert' ? ([
                            <Form.Item
                            name="epochs"
                            label="Epochs"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input /> */}
                            <InputNumber />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="learningRate"
                            label="Learning Rate"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input /> */}
                            <InputNumber />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="batchSize"
                            label="Batch Size"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input /> */}
                            <InputNumber />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="hiddenDim"
                            label="Hidden Dim"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder='100'/> */}
                            <InputNumber placeholder={100} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="shard"
                            label="Shard"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input /> */}
                            <InputNumber />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="slice"
                            label="Slice"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input /> */}
                            <InputNumber />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="dropoutValue"
                            label="Dropout Value"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.5"/> */}
                            <InputNumber placeholder={0.5} />
                            </Form.Item>,
                            <br></br>,
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
                            <br></br>,
                        ]) : 
                        getFieldValue('detector') === 'IMCFN' ? ([
                            <Form.Item
                            name="batchSize"
                            label="Batch Size"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="4"/> */}
                            <InputNumber placeholder={4} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="learningRate"
                            label="Learning Rate"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="1e-5"/> */}
                            <InputNumber placeholder={1e-5} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="rotation"
                            label="Rotation"
                            >
                            {/* <Input placeholder="[0, 0]"/> */}
                            {/* <InputNumber placeholder={'[0, 0]'} /> */}
                            <Form.Item
                            name="rotation1"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            <Form.Item
                            name="rotation2"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="widthShift"
                            label="Width Shift"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.0"/> */}
                            <InputNumber placeholder={0.0} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="heightShift"
                            label="Height Shift"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.0"/> */}
                            <InputNumber placeholder={0.0} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="zoom"
                            label="Zoom"
                            >
                            {/* <Input placeholder="[1.0, 1.0]"/> */}
                            {/* <InputNumber placeholder={'[1.0, 1.0]'} /> */}
                            <Form.Item
                            name="zoom1"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={'1.0'} />
                            </Form.Item>
                            <Form.Item
                            name="zoom2"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={'1.0'} />
                            </Form.Item>
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="shear"
                            label="Shear"
                            >
                            {/* <Input placeholder="[0, 0, 0, 0]"/> */}
                            {/* <InputNumber placeholder={'[0, 0, 0, 0]'} /> */}
                            <Form.Item
                            name="shear1"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            <Form.Item
                            name="shear2"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            <Form.Item
                            name="shear3"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            <Form.Item
                            name="shear4"
                            rules={[
                            {
                                required: true,
                            },
                            ]}
                            style={{
                            display: 'inline-block',
                            // width: 'calc(50% - 8px)',
                            }}
                            >
                                <InputNumber placeholder={0} />
                            </Form.Item>
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="fill"
                            label="Fill"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <Input placeholder="null"/>
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="horizontalFlip"
                            label="Horizontal Flip"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0"/> */}
                            <InputNumber placeholder={0} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="trainRatio"
                            label="Train Ratio"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.8"/> */}
                            <InputNumber placeholder={0.8} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="epochs"
                            label="Epochs"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="15"/> */}
                            <InputNumber placeholder={15} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="shard"
                            label="Shard"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="8"/> */}
                            <InputNumber placeholder={8} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="slice"
                            label="Slice"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="8"/> */}
                            <InputNumber placeholder={8} />
                            </Form.Item>,
                            <br></br>,
                        ]) : 
                        getFieldValue('detector') === 'MDOEL' ? ([
                            <Form.Item
                            name="batchSize"
                            label="Batch Size"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="4"/> */}
                            <InputNumber placeholder={4} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="trainRatio"
                            label="Train Ratio"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.8"/> */}
                            <InputNumber placeholder={0.8} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="validationRatio"
                            label="Validation Ratio"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.2"/> */}
                            <InputNumber placeholder={0.2} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="learningRate"
                            label="Learning Rate"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="0.0005"/> */}
                            <InputNumber placeholder={0.0005} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="epochs"
                            label="Epochs"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="3"/> */}
                            <InputNumber placeholder={3} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="shard"
                            label="Shard"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="8"/> */}
                            <InputNumber placeholder={8} />
                            </Form.Item>,
                            <br></br>,
                            <Form.Item
                            name="slice"
                            label="Slice"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            {/* <Input placeholder="8"/> */}
                            <InputNumber placeholder={8} />
                            </Form.Item>,
                            <br></br>,
                        ]) : null
                        }
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                        <Button href='/Detector'>
                            Back
                        </Button>
                        {/* <Button type="link" htmlType="button" onClick={onFill}>
                            Fill form
                        </Button> */}
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            {/* <div className='button set' style={{padding: '15px 30px 30px 0px'}}>
                <Flex justify="flex-end" align='flex-end' gap="small" wrap>
                    <Button type="primary">Save</Button>
                </Flex>
            </div> */}
            
        </div>
    );
}