import { useCallback, useEffect } from 'react';
import React, { useRef, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Checkbox, Table, Button, message, Tag, Tooltip, Input, Space, Modal, Select, Dropdown, Divider, Flex } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { memo } from './detailMemo';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

import Highlighter from 'react-highlight-words';
import errorHandler from '@/request/errorHandler';
import { request } from '@/request';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Tooltip title="Add Data">
      <Button shape="circle" onClick={handelClick} >
        {ADD_NEW_ENTITY}
      </Button>
    </Tooltip>
  );
}

export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleMultiEdit() {
    const all_updatedItems = [];
    selectedRowKeys.forEach(key => {
      const index = dataSource.findIndex(item => item._id === key);
      if (index !== -1) {
        const updatedItem = { ...dataSource[index] };
  
        if (FilenameDisabled) {
          updatedItem.filename = NewFilename;
        }
        if (LabelDisabled) {
          updatedItem.label = NewLabel;
        }
        if (FamilyDisabled) {
          updatedItem.family = NewFamily;
        }
        if (CPUDisabled) {
          updatedItem.CPUArchitecture = NewCpu;
        }
        if (FilesizeDisabled) {
          updatedItem.fileSize = NewFilesize;
        }
        if (TypeDisabled) {
          updatedItem.tags = NewType;
        }

        all_updatedItems.push(updatedItem);
      }
    });
    console.log('all_updatedItems: ', all_updatedItems);
    dispatch(crud.currentItem({ data: all_updatedItems }));
    dispatch(crud.currentAction({ actionType: 'updateAll', data: all_updatedItems }));
    dispatch(crud.updateAll({ entity, id: selectedRowKeys, jsonData: all_updatedItems }));
    setSelectedRowKeys([]);
  }
  function handleDelete() {
    selectedRowKeys.forEach(key => {
      const index = dataSource.findIndex(item => item._id === key);
      if (index !== -1) {
        dispatch(crud.currentAction({ actionType: 'delete', data: dataSource[index] }));
        modal.open();
      }
    });
    setSelectedRowKeys([]);
  }

  /* ----- Table column search ----- */
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={dataIndex === 'datasetID' ? memo.id : `Search ${dataIndex}`}
          value={`${selectedKeys[0] || ''}`}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onChange={(e) => setSelectedKeys(memo.id)}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Clear
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  /* ----- Table column search END ----- */


  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;
  console.log('dataSource: ', dataSource);


  /* ----- Table column filter option ----- */
  const all_label = [];
  const all_family = [];
  const all_cpu = [];
  function checkLabels(data) {
    data.forEach(item => {
      if (!all_label.some(labelObj => labelObj.text === item.label)) {
        all_label.push({ text: item.label, value: item.label });
      }
      if (!all_family.some(labelObj => labelObj.text === item.family)) {
        all_family.push({ text: item.family, value: item.family });
      }
      if (!all_cpu.some(labelObj => labelObj.text === item.CPUArchitecture)) {
        all_cpu.push({ text: item.CPUArchitecture, value: item.CPUArchitecture });
      }
    });
  }
  checkLabels(dataSource);
  /* ----- Table column filter option END ----- */


  const handleDetailClick = (record) => {
    memo.id = record._id;
    memo.name = record.datasetName;
    console.log('record:', record);
    console.log('memo.id:', memo.id);
    console.log('memo.name:', memo.name);
    navigate('/datasetDetail');
  };
  const handleUnlearnEditClick = (record) => {
    memo.id = record._id;
    memo.name = record.datasetName;
    console.log('record:', record);
    console.log('memo.id:', memo.id);
    console.log('memo.name:', memo.name);
    navigate('/unlearnEdit');
  };
  // const handlePredictClick = () => {
  //   const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
  //   memo.detector = selectedData
  //   console.log('memo.detector:', memo.detector);
  //   navigate('/predictDataset');
  // };


  /* ----- Table columns ----- */
  const columns = [
    {
      title: 'Filename',
      dataIndex: ["filename"],
      key: 'filename',
      ...getColumnSearchProps('filename'),
    },
    {
      title: 'Label',
      dataIndex: ["label"],
      key: 'label',
      filters: [
        ...all_label
      ],
      onFilter: (value, record) => record.label.indexOf(value) === 0,
    },
    {
      title: 'Family',
      dataIndex: ["family"],
      key: 'family',
      filters: [
        ...all_family
      ],
      onFilter: (value, record) => record.family.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: 'Cpuarchitecture',
      dataIndex: ["CPUArchitecture"],
      key: 'CPUArchitecture',
      filters: [
        ...all_cpu
      ],
      onFilter: (value, record) => record.CPUArchitecture.indexOf(value) === 0,
    },
    {
      title: 'Filesize',
      dataIndex: ["fileSize"],
      key: 'fileSize',
      sorter: (a, b) => a.fileSize - b.fileSize,
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {
            <Tag color={tags === 'test' ? 'blue' : tags === 'train' ? 'green' : tags === 'unlearn' ? 'purple' : tags === 'predict' ? 'orange' : 'default'} key={tags} >
              {tags}
            </Tag>
          }
        </>
      ),
      filters: [
        {
          text: 'test',
          value: 'test',
        },
        {
          text: 'train',
          value: 'train',
        },
        {
          text: 'unlearn',
          value: 'unlearn',
        },
        {
          text: 'predict',
          value: 'predict',
        },
      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <EditOutlined
          style={{ cursor: 'pointer', fontSize: '15px' }}
          onClick={(e) => {
            e.preventDefault();
            handleEdit(record);
          }}
        />
      ),
    },
  ];
  const detail_columns = [
    {
      title: 'datasetID',
      dataIndex: ["datasetID"],
      key: 'datasetID',
      ...getColumnSearchProps('datasetID'),
    },
    {
      title: 'Filename',
      dataIndex: ["filename"],
      key: 'filename',
      ...getColumnSearchProps('filename'),
    },
    {
      title: 'Label',
      dataIndex: ["label"],
      key: 'label',
      filters: [
        ...all_label
      ],
      onFilter: (value, record) => record.label.indexOf(value) === 0,
    },
    {
      title: 'Family',
      dataIndex: ["family"],
      key: 'family',
      filters: [
        ...all_family
      ],
      onFilter: (value, record) => record.family.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: 'Cpuarchitecture',
      dataIndex: ["CPUArchitecture"],
      key: 'CPUArchitecture',
      filters: [
        ...all_cpu
      ],
      onFilter: (value, record) => record.CPUArchitecture.indexOf(value) === 0,
    },
    {
      title: 'Filesize',
      dataIndex: ["fileSize"],
      key: 'fileSize',
      sorter: (a, b) => a.fileSize - b.fileSize,
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {
            <Tag color={tags === 'test' ? 'blue' : tags === 'train' ? 'green' : tags === 'unlearn' ? 'purple' : tags === 'predict' ? 'orange' : 'default'} key={tags} >
              {tags}
            </Tag>
          }
        </>
      ),
      filters: [
        {
          text: 'test',
          value: 'test',
        },
        {
          text: 'train',
          value: 'train',
        },
        {
          text: 'unlearn',
          value: 'unlearn',
        },
        {
          text: 'predict',
          value: 'predict',
        },
      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
    },
    // {
    //   title: '',
    //   key: 'action',
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <EditOutlined
    //       style={{ cursor: 'pointer', fontSize: '15px' }}
    //       onClick={(e) => {
    //         e.preventDefault();
    //         handleEdit(record);
    //       }}
    //     />
    //   ),
    // },
  ];
  const dataset_columns = [
    {
      title: 'Dataset Name',
      dataIndex: ["datasetName"],
      key: 'datasetName',
      ...getColumnSearchProps('datasetName'),
    },
    // {
    //   title: '',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 80,
    //   render: (_, record) => (
    //     <Dropdown
    //       menu={{
    //         items,
    //         onClick: ({ key }) => {
    //           switch (key) {
    //             case 'read':
    //               handleRead(record);
    //               break;
    //             case 'edit':
    //               handleEdit(record);
    //               break;

    //             // case 'delete':
    //             //   handleDelete(record);
    //             //   break;
    //             case 'updatePassword':
    //               handleUpdatePassword(record);
    //               break;

    //             default:
    //               break;
    //           }
    //           // else if (key === '2')handleCloseTask
    //         },
    //       }}
    //       trigger={['click']}
    //     >
    //       <EllipsisOutlined
    //         style={{ cursor: 'pointer', fontSize: '24px' }}
    //         onClick={(e) => e.preventDefault()}
    //       />
    //     </Dropdown>
    //   ),
    // },
    {
      title: '',
      key: 'operation',
      width: 80,
      render: (_, record) => (
        <Button
          onClick={() => handleDetailClick(record)}
        >
          Detail
        </Button>
      ),
    },
  ];
  const detector_columns = [
    {
      title: 'Detector',
      dataIndex: ["modelName"],
      key: 'modelName',
      ...getColumnSearchProps('modelName'),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          {
            <Tag 
              color={
                status === 'untrained' ? 'default'
                : status === 'training' ? 'processing'
                : status === 'trained' ? 'success'
                : status === 'predicting' ? 'processing'
                : status === 'unlearning' ? 'processing'
                : status === 'error' ? 'error'
                : 'default'
              }
              icon={
                status === 'training' ? <SyncOutlined spin />
                : status === 'trained' ? <CheckCircleOutlined />
                : status === 'predicting' ? <SyncOutlined spin />
                : status === 'unlearning' ? <SyncOutlined spin />
                : status === 'error' ? <CloseCircleOutlined />
                : <MinusCircleOutlined />
              }
              key={status}
            >
              {status}
            </Tag>
          }
        </>
      ),
      filters: [
        {
          text: 'untrained',
          value: 'untrained',
        },
        {
          text: 'training',
          value: 'training',
        },
        {
          text: 'trained',
          value: 'trained',
        },
        {
          text: 'predicting',
          value: 'predicting',
        },
        {
          text: 'unlearning',
          value: 'unlearning',
        },
        {
          text: 'error',
          value: 'error',
        },
      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                // case 'delete':
                //   handleDelete(record);
                //   break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];
  const unlearn_columns = [
    {
      title: 'Detector',
      dataIndex: ["modelName"],
      key: 'modelName',
      ...getColumnSearchProps('modelName'),
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  // handleEdit(record);
                  handleUnlearnEditClick(record)
                  break;

                // case 'delete':
                //   handleDelete(record);
                //   break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];
  const unlearnEdit_columns = [
    {
      title: 'datasetID',
      dataIndex: ["datasetID"],
      key: 'datasetID',
      ...getColumnSearchProps('datasetID'),
    },
    {
      title: 'Filename',
      dataIndex: ["filename"],
      key: 'filename',
      ...getColumnSearchProps('filename'),
    },
    {
      title: 'Label',
      dataIndex: ["label"],
      key: 'label',
      filters: [
        ...all_label
      ],
      onFilter: (value, record) => record.label.indexOf(value) === 0,
    },
    {
      title: 'Family',
      dataIndex: ["family"],
      key: 'family',
      filters: [
        ...all_family
      ],
      onFilter: (value, record) => record.family.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: 'Cpuarchitecture',
      dataIndex: ["CPUArchitecture"],
      key: 'CPUArchitecture',
      filters: [
        ...all_cpu
      ],
      onFilter: (value, record) => record.CPUArchitecture.indexOf(value) === 0,
    },
    {
      title: 'Filesize',
      dataIndex: ["fileSize"],
      key: 'fileSize',
      sorter: (a, b) => a.fileSize - b.fileSize,
    },
    {
      title: 'Type',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {
            <Tag color={tags === 'test' ? 'blue' : tags === 'train' ? 'green' : tags === 'unlearn' ? 'purple' : tags === 'predict' ? 'orange' : 'default'} key={tags} >
              {tags}
            </Tag>
          }
        </>
      ),
      filters: [
        {
          text: 'test',
          value: 'test',
        },
        {
          text: 'train',
          value: 'train',
        },
        {
          text: 'unlearn',
          value: 'unlearn',
        },
        {
          text: 'predict',
          value: 'predict',
        },
      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                // case 'delete':
                //   handleDelete(record);
                //   break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
    // {
    //   title: '',
    //   key: 'action',
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <EditOutlined
    //       style={{ cursor: 'pointer', fontSize: '15px' }}
    //       onClick={(e) => {
    //         e.preventDefault();
    //         handleEdit(record);
    //       }}
    //     />
    //   ),
    // },
  ];
  const predict_columns = [
    // {
    //   title: 'datasetID',
    //   dataIndex: ["datasetID"],
    //   key: 'datasetID',
    //   ...getColumnSearchProps('datasetID'),
    // },
    {
      title: 'Filename',
      dataIndex: ["filename"],
      key: 'filename',
      ...getColumnSearchProps('filename'),
    },
    {
      title: 'Label',
      dataIndex: ["label"],
      key: 'label',
      filters: [
        ...all_label
      ],
      onFilter: (value, record) => record.label.indexOf(value) === 0,
    },
    {
      title: 'Family',
      dataIndex: ["family"],
      key: 'family',
      filters: [
        ...all_family
      ],
      onFilter: (value, record) => record.family.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: 'Cpuarchitecture',
      dataIndex: ["CPUArchitecture"],
      key: 'CPUArchitecture',
      filters: [
        ...all_cpu
      ],
      onFilter: (value, record) => record.CPUArchitecture.indexOf(value) === 0,
    },
    {
      title: 'Filesize',
      dataIndex: ["fileSize"],
      key: 'fileSize',
      sorter: (a, b) => a.fileSize - b.fileSize,
    },
  ];
  /* ----- Table columns END ----- */


  /* ----- Table Data Handler ----- */
  const handelDataTableLoad = useCallback((pagination) => {
    console.log('handleDataTableLoad');
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);
  const dispatcher = () => {
    dispatch(crud.list({ entity }));
    console.log('dispatcher entity:', entity);
  };
  useEffect(() => {
    // console.log('useEffect');
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);
  /* ----- Table Data Handler END ----- */


  /* ----- Data selection ----- */
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  const hasSelected = selectedRowKeys.length > 0;
  /* ----- Data selection END ----- */


  /* ----- Table Button Finction ----- */
  const [loading, setLoading] = useState(false); // Button loading
  const start = () => {   // Training Button
    setLoading(true);
    const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
    console.log('Selected Data:', selectedData);
    fetch('http://localhost:1624/api/detector/train', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      message.success('Training Successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      message.error('Training Error!');
    });
    setSelectedRowKeys([]);
    setLoading(false);
  };
  const start_pre = () => {   // Predict Button
    setLoading(true);
    const detectorInfo = dataSource.filter(item => selectedRowKeys.includes(item._id));
    if(detectorInfo[0].status !== 'trained') {
      console.log('untrained...');
      message.error('You should train first!');
      setSelectedRowKeys([]);
      setLoading(false);
      return;
    }
    PredictDataset.forEach(key => {
      const selectedData = dataset.filter(item => key === item.datasetID);
      const predictData = selectedData.map(obj => {
        return { ...obj, tags: 'predict' };
      });
      const requestData = [...detectorInfo, ...predictData];
      console.log('Request Data:', requestData);
      fetch('http://localhost:1624/api/detector/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        message.success('Predict Successful!');
      })
      .catch(error => {
        console.error('Error:', error);
        message.error('Predict Error!');
      });
    });
    setSelectedRowKeys([]);
    setLoading(false);
  };
  const start_un = () => {    // Unlearn Button
    setLoading(true);
    const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
    console.log('Selected Data:', selectedData);
    if(selectedData[0].status !== 'trained') {
      console.log('untrained...');
      message.error('You should train first!');
      setSelectedRowKeys([]);
      setLoading(false);
      return;
    }
    fetch('http://localhost:1624/api/detector/unlearn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      message.success('Unlearning Successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      message.error('Unlearning Error!');
    });
    setSelectedRowKeys([]);
    setLoading(false);
  };
  const saved = () => {
    setLoading(true);
    const entity = 'dataset';
    // const requestData = [DatasetName, ...selectedRowKeys];
    const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
    const requestData = [DatasetName, ...selectedData];
    console.log('requestData: ', requestData);

    dispatch(crud.create({ entity, jsonData: requestData }));

    setSelectedRowKeys([]);
    setLoading(false);
  };
  /* ----- Table Button Finction END ----- */


  /* ----- Editing Data Modal Handler ----- */
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
    message.success('Edit was clicked!');
  };
  const handleOk = (e) => {
    handleMultiEdit();
    console.log(e);
    setOpen(false);
    dispatcher();
    handelDataTableLoad();
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };

  const [FilenameDisabled, setFilenameDisabled] = useState(false);
  const [NewFilename, setNewFilename] = useState();
  const onChangeFilename = (e) => {
    setFilenameDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const filenameInput = (e) => {
    setNewFilename(e.target.value);
    console.log('new filename: ', e.target.value);
  };

  const [LabelDisabled, setLabelDisabled] = useState(false);
  const [NewLabel, setNewLabel] = useState();
  const onChangeLabel = (e) => {
    setLabelDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const labelInput = (e) => {
    setNewLabel(e.target.value);
    console.log('new label: ', e.target.value);
  };

  const [FamilyDisabled, setFamilyDisabled] = useState(false);
  const [NewFamily, setNewFamily] = useState();
  const onChangeFamily = (e) => {
    setFamilyDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const familyInput = (e) => {
    setNewFamily(e.target.value);
    console.log('new family: ', e.target.value);
  };

  const [CPUDisabled, setCPUDisabled] = useState(false);
  const [NewCpu, setNewCpu] = useState();
  const onChangeCPU = (e) => {
    setCPUDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const cpuInput = (e) => {
    setNewCpu(e.target.value);
    console.log('new cpu: ', e.target.value);
  };

  const [FilesizeDisabled, setFilesizeDisabled] = useState(false);
  const [NewFilesize, setNewFilesize] = useState();
  const onChangeFilesize = (e) => {
    setFilesizeDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const filesizeInput = (e) => {
    setNewFilesize(e.target.value);
    console.log('new filesize: ', e.target.value);
  };

  const [TypeDisabled, setTypeDisabled] = useState(false);
  const [NewType, setNewType] = useState();
  const onChangeType = (e) => {
    setTypeDisabled(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const typeInput = (e) => {
    setNewType(e);
    console.log('new type: ', e);
  };
  /* ----- Editing Data Modal Handler END ----- */


  /* ----- Creating Dataset Modal Handler ----- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showSaveModal = () => {
    setIsModalOpen(true);
  };
  const handleSaveOk = () => {
    saved();
    setIsModalOpen(false);
  };
  const handleSaveCancel = () => {
    setIsModalOpen(false);
  };
  const [DatasetName, setDatasetName] = useState();
  const saveInput = (e) => {
    setDatasetName(e.target.value);
    console.log('dataset name: ', e.target.value);
  };
  /* ----- Creating Dataset Modal Handler END ----- */


  /* ----- Predict Modal Handler ----- */
  const [options, setOptions] = useState([]);
  const [dataset, setDataset] = useState([]);
  const asyncList = (entity) => {
      return request.list({ entity });
  };
  useEffect(() => {
      async function fetchData() {
          try {
              const data = await asyncList('datasetname');
              console.log('useEffect data(options): ', data);
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
            const data = await asyncList('dataset');
            console.log('useEffect data(dataset): ', data);
            setDataset(data.result);
        } catch (error) {
            console.log('useEffect erorr!');
            errorHandler(error);
        }
    }
    fetchData();
}, []);
  const [preModalOpen, setPreModalOpen] = useState(false);
  const showPredictModal = () => {
    setPreModalOpen(true);
  };
  const handlePredict = () => {
    start_pre();
    setPreModalOpen(false);
  };
  const handlePredictCancel = () => {
    setPreModalOpen(false);
  };
  const [PredictDataset, setPredictDataset] = useState([]);
  const onPredictDatasetChange = (e) => {
    setPredictDataset(e);
    console.log('PredictDataset _id: ', e);
  };
  /* ----- Predict Modal Handler END ----- */


  /* ----- Table Rendering ----- */
  const renderTable = () => {
    if(DATATABLE_TITLE === 'Dataset') {
      return (
        <Table 
          columns={dataset_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          rowSelection={rowSelection}
        />
      );
    } else if(DATATABLE_TITLE === 'Detector') {
      return (
        <Table
          columns={detector_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          // rowSelection={rowSelection}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
        />
      );
      
    } else if(DATATABLE_TITLE === 'Unlearn') {
      return (
        <Table
          columns={unlearn_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          // rowSelection={rowSelection}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
        />
      );
      
    } else if(DATATABLE_TITLE === 'Select Your Dataset') {
      return (
        <Table
          columns={columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          rowSelection={rowSelection}
        />
      );
    } else if(DATATABLE_TITLE === 'Dataset Detail') {
      return (
        <Table
          columns={detail_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          rowSelection={rowSelection}
        />
      );
    } else if(DATATABLE_TITLE === 'Unlearn Edit') {
      return (
        <Table
          columns={unlearnEdit_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          rowSelection={rowSelection}
        />
      );
    } else if(DATATABLE_TITLE === 'Predict Dataset') {
      return (
        <Table
          columns={predict_columns}
          rowKey={(item) => item._id}
          dataSource={dataSource}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
          bordered
          scroll={{ x: true }}
          rowSelection={rowSelection}
        />
      );
    }
  };
  /* ----- Table Rendering END ----- */


  /* ----- Table Button Rendering ----- */
  const renderButtons = () => {
    if (DATATABLE_TITLE === 'Select Your Dataset') {
      return [
        <Button type='primary' onClick={showSaveModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          {hasSelected ? `Save ${selectedRowKeys.length} items` : 'Save'}
        </Button>,
        <Modal title="Saving Dataset" open={isModalOpen} onOk={handleSaveOk} onCancel={handleSaveCancel}>
          <Input 
            name='Dataset Name'
            onChange={saveInput}
            allowClear
            placeholder='enter your dataset name...'
          />
        </Modal>,
        <Button onClick={showModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          {hasSelected ? `Edit ${selectedRowKeys.length} items` : 'Edit'}
        </Button>,
        <Modal
          title="Edit Items"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Edit"
        >
          <Checkbox 
            checked={FilenameDisabled}
            onChange={onChangeFilename}
          >
            Filename
          </Checkbox>
          <Input 
            name='filename'
            onChange={filenameInput}
            disabled={!FilenameDisabled} 
            allowClear
          />

          <Checkbox 
            checked={LabelDisabled}
            onChange={onChangeLabel}
          >
            Label
          </Checkbox>
          <Input
            name='label'
            onChange={labelInput}
            disabled={!LabelDisabled}
            allowClear
          />

          <Checkbox 
            checked={FamilyDisabled}
            onChange={onChangeFamily}
          >
            Family
          </Checkbox>
          <Input 
            name='family'
            onChange={familyInput}
            allowClear
            disabled={!FamilyDisabled}
          />

          <Checkbox 
            checked={CPUDisabled}
            onChange={onChangeCPU}
          >
            Cpuarchitecture
          </Checkbox>
          <Input 
            name='cpu'
            onChange={cpuInput}
            allowClear
            disabled={!CPUDisabled}
          />

          <Checkbox 
            checked={FilesizeDisabled}
            onChange={onChangeFilesize}
          >
            Filesize
          </Checkbox>
          <Input 
            name='filesize'
            onChange={filesizeInput}
            allowClear
            disabled={!FilesizeDisabled}
          />

          <Checkbox 
            checked={TypeDisabled}
            onChange={onChangeType}
          >
            Type
          </Checkbox>
          {/* <Input 
            name='type'
            onChange={typeInput}
            allowClear
            disabled={!TypeDisabled}
          /> */}
          <Select
            onChange={typeInput}
            placeholder="Select a tag"
            style={{
              width: 472,
            }}
            options={[
              {
                value: 'test',
                label: 'test',
              },
              {
                value: 'train',
                label: 'train',
              },
              {
                value: 'unlearn',
                label: 'unlearn',
              },
              {
                value: 'predict',
                label: 'predict',
              },
            ]}
            allowClear
            disabled={!TypeDisabled}
          />
        </Modal>,
        <AddNewItem key={`${uniqueId()}`} config={config} />,
        <Tooltip title="Delete">
          <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
        </Tooltip>,
      ];
    } else if (DATATABLE_TITLE === 'Dataset') {
      return [
        <Button type="primary" href='/Detector1Test' key={`${uniqueId()}`}>
          Add
        </Button>,
        <Tooltip title="Delete">
          <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
        </Tooltip>,
      ];
    } else if (DATATABLE_TITLE === 'Detector') {
      return [
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
          {/* {hasSelected ? `Train ${selectedRowKeys.length} items` : 'Train'} */}
          Train
        </Button>,
        <Tooltip title="Select Predict Dataset">
          <Button type="primary" onClick={showPredictModal} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
            Predict
          </Button>
        </Tooltip>,
        <Modal
          title="Select Dataset"
          open={preModalOpen}
          onOk={handlePredict}
          onCancel={handlePredictCancel}
          okText="Predict"
        >
          <Select
          mode="multiple"
          style={{
            width: '100%',
          }}
          placeholder="Select dataset..."
          onChange={onPredictDatasetChange}
          >
              {Array.isArray(options) && options.length > 0 && options.map((option) => (
                  <Select.Option value={option._id}>
                  {option.datasetName}
                  </Select.Option>
              ))}
          </Select>
          
        </Modal>,
        <Button href='/detectorSetting' key={`${uniqueId()}`}>
          Create
        </Button>,
        <Tooltip title="Delete">
          <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
        </Tooltip>,
      ];
    } else if (DATATABLE_TITLE === 'Unlearn') {
      return [
        <Button type="primary" onClick={start_un} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
          {hasSelected ? `Unlearn ${selectedRowKeys.length} items` : 'Unlearn'}
        </Button>,
        <Tooltip title="Delete">
          <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
        </Tooltip>,
      ];
    } else if (DATATABLE_TITLE === 'Dataset Detail') {
      return [
        <h5>datasetname: {memo.name} (id: {memo.id})</h5>,
        <Button onClick={showModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          {hasSelected ? `Edit ${selectedRowKeys.length} items` : 'Edit'}
        </Button>,
        <Modal
          title="Edit Items"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Edit"
        >
          <Checkbox 
            checked={TypeDisabled}
            onChange={onChangeType}
          >
            Type
          </Checkbox>
          <Select
            onChange={typeInput}
            placeholder="Select a tag"
            style={{
              width: 472,
            }}
            options={[
              {
                value: 'test',
                label: 'test',
              },
              {
                value: 'train',
                label: 'train',
              },
              {
                value: 'unlearn',
                label: 'unlearn',
              },
            ]}
            allowClear
            disabled={!TypeDisabled}
          />
        </Modal>,
      ];
    } else if (DATATABLE_TITLE === 'Unlearn Edit') {
      return [
        <h5>datasetname: {memo.name} (id: {memo.id})</h5>,
        <Button onClick={showModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          {hasSelected ? `Edit ${selectedRowKeys.length} items` : 'Edit'}
        </Button>,
        <Modal
          title="Edit Items"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Edit"
        >
          <Checkbox 
            checked={TypeDisabled}
            onChange={onChangeType}
          >
            Type
          </Checkbox>
          <Select
            onChange={typeInput}
            placeholder="Select a tag"
            style={{
              width: 472,
            }}
            options={[
              {
                value: 'test',
                label: 'test',
              },
              {
                value: 'train',
                label: 'train',
              },
              {
                value: 'unlearn',
                label: 'unlearn',
              },
              {
                value: 'predict',
                label: 'predict',
              },
            ]}
            allowClear
            disabled={!TypeDisabled}
          />
        </Modal>,
        <Tooltip title="Delete">
          <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
        </Tooltip>,
      ];
    } else if (DATATABLE_TITLE === 'Predict Dataset') {
      return [
        <Button type="primary" onClick={start_pre} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
          Predict
        </Button>,
      ];
    }
  };
  /* ----- Table Button Rendering END ----- */


  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          ...renderButtons(),
          <Tooltip title="Reload">
            <Button shape="circle" onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<ReloadOutlined />} />
          </Tooltip>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      {renderTable()}
    </>
  );
}