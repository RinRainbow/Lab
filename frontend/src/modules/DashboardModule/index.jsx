import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { tagColor } from '@/utils/statusTagColor';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import React from 'react';
import { Flex, Form, Select, List, Progress, Card } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Option } = Select;
const layout = {
  labelCol: {
    // span: 8,
  },
  wrapperCol: {
    span: 5,
  },
};
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];
const conicColors = {
  '0%': '#ffccc7',
  '50%': '#ffe58f',
  '100%': '#87d068',
};

export default function DashboardModule() {
  const translate = useLanguage();
  const [form] = Form.useForm();
  // const onModelChange = (value) => {
  //     switch (value) {
  //         case 'detector1':
  //         form.setFieldsValue({
  //             modelname: 'Hi, detector1!',
  //         });
  //         break;
  //         case 'detector2':
  //         form.setFieldsValue({
  //             modelname: 'Hi, detector2!',
  //         });
  //         break;
  //         case 'MalwareExpert':
  //         form.setFieldsValue({
  //             modelname: 'Hi MalwareExpert!',
  //         });
  //         break;
  //         default:
  //     }
  // };
  // const onFinish = (values) => {
  //     console.log(values);
  // };
  // const { moneyFormatter } = useMoney();
  // const { result: invoiceResult, isLoading: invoiceLoading } = useFetch(() =>
  //   request.summary({ entity: 'invoice' })
  // );

  // const { result: quoteResult, isLoading: quoteLoading } = useFetch(() =>
  //   request.summary({ entity: 'quote' })
  // );

  // const { result: offerResult, isLoading: offerLoading } = useFetch(() =>
  //   request.summary({ entity: 'offer' })
  // );

  // const { result: paymentResult, isLoading: paymentLoading } = useFetch(() =>
  //   request.summary({ entity: 'payment' })
  // );

  // const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
  //   request.summary({ entity: 'client' })
  // );

  // const dataTableColumns = [
  //   {
  //     title: translate('number'),
  //     dataIndex: 'number',
  //   },
  //   {
  //     title: translate('Client'),
  //     dataIndex: ['client', 'name'],
  //   },

  //   {
  //     title: translate('Total'),
  //     dataIndex: 'total',
  //     onCell: () => {
  //       return {
  //         style: {
  //           textAlign: 'right',
  //           whiteSpace: 'nowrap',
  //         },
  //       };
  //     },
  //     render: (total) => moneyFormatter({ amount: total }),
  //   },
  //   {
  //     title: translate('Status'),
  //     dataIndex: 'status',
  //     render: (status) => {
  //       return <Tag color={tagColor(status)?.color}>{translate(status)}</Tag>;
  //     },
  //   },
  // ];

  // const entityData = [
  //   {
  //     result: invoiceResult,
  //     isLoading: invoiceLoading,
  //     entity: 'invoice',
  //     title: translate('Invoices preview'),
  //   },
  //   {
  //     result: quoteResult,
  //     isLoading: quoteLoading,
  //     entity: 'quote',
  //     title: translate('quotes preview'),
  //   },
  //   {
  //     result: offerResult,
  //     isLoading: offerLoading,
  //     entity: 'offer',
  //     title: translate('offers preview'),
  //   },
  //   {
  //     result: paymentResult,
  //     isLoading: paymentLoading,
  //     entity: 'payment',
  //     title: translate('payments preview'),
  //   },
  // ];

  // const cards = entityData.map((data, index) => {
  //   const { result, entity, isLoading } = data;

  //   if (entity === 'offer') return null;

  //   return (
  //     <SummaryCard
  //       key={index}
  //       title={data?.entity === 'payment' ? translate('Payment') : translate(data?.entity)}
  //       tagColor={
  //         data?.entity === 'invoice' ? 'cyan' : data?.entity === 'quote' ? 'purple' : 'green'
  //       }
  //       prefix={translate('This month')}
  //       isLoading={isLoading}
  //       tagContent={moneyFormatter({ amount: result?.total })}
  //     />
  //   );
  // });

  // const statisticCards = entityData.map((data, index) => {
  //   const { result, entity, isLoading, title } = data;

  //   if (entity === 'payment') return null;

  //   return (
  //     <PreviewCard
  //       key={index}
  //       title={title}
  //       isLoading={isLoading}
  //       entity={entity}
  //       statistics={
  //         !isLoading &&
  //         result?.performance?.map((item) => ({
  //           tag: item?.status,
  //           color: 'blue',
  //           value: item?.percentage,
  //         }))
  //       }
  //     />
  //   );
  // });

  return (
    <>
      {/* <Row gutter={[32, 32]}>
        {cards}
        <SummaryCard
          title={translate('Due Balance')}
          tagColor={'red'}
          prefix={translate('Not Paid')}
          isLoading={invoiceLoading}
          tagContent={moneyFormatter({ amount: invoiceResult?.total_undue })}
        />
      </Row> */}
      {/* <div className="space30"></div> */}
      {/* <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ height: 458 }}>
            <Row className="pad20" gutter={[0, 0]}>
              {statisticCards}
            </Row>
          </div>
        </Col>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          />
        </Col>
      </Row> */}
      {/* <div className="space30"></div> */}
      {/* <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Recent Invoices')}
            </h3>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>

        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Recent Quotes')}
            </h3>
            <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row> */}
      <div className="whiteBox shadow">
          <div className='setting area' style={{padding: '30px 30px 30px 30px'}}>
              <Form
                  {...layout}
                  form={form}
                  name="control-hooks"
                  // onFinish={onFinish}
                  style={{
                    maxWidth: '100%',
                  }}
              >
                  <Form.Item
                      name="modelname"
                      label="Model Name"
                  >
                      <Select
                      placeholder="Select a model name"
                      // onChange={onModelChange}
                      allowClear
                      >
                      <Option value="aaa">aaa</Option>
                      <Option value="bbb">bbb</Option>
                      <Option value="ccc">ccc</Option>
                      </Select>
                  </Form.Item>
                  <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => prevValues.modelname !== currentValues.modelname}
                  >
                      {({ getFieldValue }) =>
                      getFieldValue('modelname') === 'ccc' ? ([
                          <br></br>,
                          <Flex justify='space-evenly' align='center'>
                              <Card>
                                <List
                                header={<div>Header</div>}
                                footer={<div>Footer</div>}
                                // bordered
                                dataSource={data}
                                renderItem={(item) => (
                                  <List.Item>
                                    {item}
                                  </List.Item>
                                )}
                                />
                              </Card>
                              <Card style={{ height: 300, width: 300 }}>
                                <div
                                  className="pad20"
                                  style={{
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <h3 style={{ color: '#22075e', marginBottom: 40, marginTop: 15, fontSize: 'large' }}>
                                    Predict Score
                                  </h3>

                                  <div
                                    style={{
                                      display: 'grid',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Progress type="dashboard" percent={93} strokeColor={conicColors} format={(percent) => `${percent}`} size={148} />
                                  </div>
                                </div>
                              </Card>
                          </Flex>,
                      ]) : null
                      }
                  </Form.Item>
              </Form>
          </div>
          
      </div>
    </>
  );
}
