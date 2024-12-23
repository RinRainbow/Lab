import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';
import errorHandler from '@/request/errorHandler';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { tagColor } from '@/utils/statusTagColor';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import React, { useEffect, useState } from 'react';
import { Flex, Form, Select, List, Progress, Card, Typography, Divider, Table } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Option } = Select;
const asyncList = (entity) => {
  return request.list({ entity });
};
const layout = {
  labelCol: {
    // span: 8,
  },
  wrapperCol: {
    span: 5,
  },
};
const { Text } = Typography;

const columns = [
  {
    title: 'Data Name',
    dataIndex: 'dataname',
    key: 'dataname',
  },
  {
    title: 'Detection',
    dataIndex: 'detection',
    key: 'detection',
  },
];

const ObjectDisplay = ({ obj }) => {
  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return <ObjectDisplay obj={value} />;
    }
    return <Text>{String(value)}</Text>;
  };

  const renderList = (key, value) => {
    if(key !== '_id' && key !== 'enabled' && key !== 'datasetId' && key !== 'isPublic' && key !== 'createdBy' && key !== 'created' && key !== 'updated' && key !== '__v') {
      if(key === 'rotation' || key === 'zoom' || key === 'shear') {
        if(Array.isArray(value) && value.length > 0) {
          <List.Item>
            <Text strong>{key}:</Text> {renderValue(value)}
          </List.Item>
        }
      } else {
        return (
          <List.Item>
            <Text strong>{key}:</Text> {renderValue(value)}
          </List.Item>
        );
      }
      // return (
      //   <List.Item>
      //     <Text strong>{key}:</Text> {renderValue(value)}
      //   </List.Item>
      // ); 
    }
  };

  return (
    <List
      dataSource={Object.entries(obj)}
      renderItem={([key, value]) => (
        // if(key !== '_id' && key !== 'enabled' && key !== 'datasetId' && key !== 'isPublic' && key !== 'createdBy' && key !== 'created' && key !== 'updated' && key !== '__v') (
        //   <List.Item>
        //     <Text strong>{key}:</Text> {renderValue(value)}
        //   </List.Item>
        // )
        renderList(key, value)
      )}
    />
  );
};
const ModelDisplay = ({ getFieldValue, options, score, predictResult }) => {
  if(!options || !options.length) return null;
  console.log('options: ', options);
  const selectedModel = options.find(item => item.modelName === getFieldValue('modelname'));
  console.log('selectedModel: ', selectedModel);

  if (!selectedModel) return null;

  const selectedScore = score.find(item => item.modelName === getFieldValue('modelname'));
  console.log('selectedScore: ', selectedScore);

  const pre_result = [];
  if(predictResult) {
    predictResult.forEach(item => {
      if(item.modelName === getFieldValue('modelname')) {
        pre_result.push(item);
      }
    });
  }
  
  console.log('predictResult: ', predictResult);
  console.log('pre_result: ', pre_result);

  // const { settingData, predictScore } = selectedModel;

  const conicColors = {
    '0%': '#ffccc7',
    '50%': '#ffe58f',
    '100%': '#87d068',
  };

  return (
    <>
      <br />
      <Flex justify='space-evenly' align='flex-start'>
        <Card>
        {/* <Card title="Model Details" style={{ width: '100%', maxWidth: 600 }}> */}
          {/* <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            dataSource={selectedModel}
            renderItem={(item) => (
              <List.Item>
                {item}
              </List.Item>
            )}
          /> */}
          <ObjectDisplay obj={selectedModel} />
        </Card>
        <Card style={{ height: '100%', width: 200 }}>
          <div
            className="pad20"
            style={{
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <h3 style={{ color: '#22075e', marginBottom: 20, marginTop: 15 }}>
              Training Score
            </h3>
            <Divider />
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <Text>accuracy</Text>
              <Progress 
                type="dashboard" 
                percent={selectedScore ? selectedScore.accuracy*100 : 0}
                strokeColor={conicColors} 
                format={(percent) => `${percent.toFixed(2)}`} 
                size={100} 
              />
              <br></br>
              <Text>f1_score</Text>
              <Progress 
                type="dashboard" 
                percent={selectedScore ? selectedScore.f1_score*100 : 0} 
                strokeColor={conicColors} 
                format={(percent) => `${percent.toFixed(2)}`} 
                size={100} 
              />
              <br></br>
              <Text>precision</Text>
              <Progress 
                type="dashboard" 
                percent={selectedScore ? selectedScore.precision*100 : 0} 
                strokeColor={conicColors} 
                format={(percent) => `${percent.toFixed(2)}`} 
                size={100} 
              />
              <br></br>
              <Text>recall</Text>
              <Progress 
                type="dashboard" 
                percent={selectedScore ? selectedScore.recall*100 : 0} 
                strokeColor={conicColors} 
                format={(percent) => `${percent.toFixed(2)}`} 
                size={100} 
              />
            </div>
          </div>
        </Card>
        <Card>
          <h3 style={{ color: '#22075e', marginBottom: 20, marginTop: 15 }}>
            Predict Result
          </h3>
          <Table
            dataSource={pre_result}
            columns={columns}
          />
        </Card>
        {/* <Table
          dataSource={pre_result}
          columns={columns}
        /> */}
      </Flex>
    </>
  );
};

export default function DashboardModule() {
  const [options, setOptions] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [predictResult, setPredictResult] = useState([]);
  useEffect(() => {
      async function fetchData() {
          try {
              const data = await asyncList('modelsetting');
              console.log('useEffect data: ', data);
              setOptions(data.result);
          } catch (error) {
              console.log('useEffect erorr!');
              errorHandler(error);
          }
      }
      fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
        try {
            const data = await asyncList('score');
            console.log('useEffect data: ', data);
            setScoreData(data.result);
        } catch (error) {
            console.log('useEffect erorr!');
            errorHandler(error);
        }
    }
    fetchData();
}, []);
useEffect(() => {
  async function fetchData() {
      try {
          const data = await asyncList('predictresult');
          console.log('useEffect data: ', data);
          setPredictResult(data.result);
      } catch (error) {
          console.log('useEffect erorr!');
          errorHandler(error);
      }
  }
  fetchData();
}, []);
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
                      // allowClear
                      >
                          {Array.isArray(options) && options.length > 0 && options.map((option) => (
                              <Option key={option._id} value={option.modelName}>
                              {option.modelName}
                              </Option>
                          ))}
                      </Select>
                  </Form.Item>
                  <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => prevValues.modelname !== currentValues.modelname}
                  >
                      {({ getFieldValue }) =>
                      // getFieldValue('modelname') === 'MDOELtest2' ? ([
                      //     <br></br>,
                      //     <Flex justify='space-evenly' align='center'>
                      //         <Card>
                      //           <List
                      //           header={<div>Header</div>}
                      //           footer={<div>Footer</div>}
                      //           // bordered
                      //           dataSource={settingData}
                      //           renderItem={(item) => (
                      //             <List.Item>
                      //               {item}
                      //             </List.Item>
                      //           )}
                      //           />
                      //         </Card>
                      //         <Card style={{ height: 300, width: 300 }}>
                      //           <div
                      //             className="pad20"
                      //             style={{
                      //               textAlign: 'center',
                      //               justifyContent: 'center',
                      //             }}
                      //           >
                      //             <h3 style={{ color: '#22075e', marginBottom: 40, marginTop: 15, fontSize: 'large' }}>
                      //               Predict Score
                      //             </h3>

                      //             <div
                      //               style={{
                      //                 display: 'grid',
                      //                 justifyContent: 'center',
                      //               }}
                      //             >
                      //               <Progress type="dashboard" percent={93} strokeColor={conicColors} format={(percent) => `${percent}`} size={148} />
                      //             </div>
                      //           </div>
                      //         </Card>
                      //     </Flex>,
                      // ]) : null
                      <ModelDisplay getFieldValue={form.getFieldValue} options={options} score={scoreData} predictResult={predictResult} />
                      }
                      {/* <ModelDisplay getFieldValue={form.getFieldValue} options={options} /> */}
                  </Form.Item>
              </Form>
          </div>
          
      </div>
    </>
  );
}
