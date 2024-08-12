import { useCallback, useEffect } from 'react';
import React, { useRef, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Checkbox, Table, Button, message, Tag, Tooltip, Input, Space, Modal, Select } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

import Highlighter from 'react-highlight-words';

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
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
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
  
        // dispatch(crud.currentItem({ data: updatedItem }));
        // dispatch(crud.currentAction({ actionType: 'update', data: updatedItem }));
        // dispatch(crud.update({ entity, id: key, jsonData: updatedItem }));
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
    // dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    // modal.open();
  }

  // function handleUpdatePassword(record) {
  //   dispatch(crud.currentItem({ data: record }));
  //   dispatch(crud.currentAction({ actionType: 'update', data: record }));
  //   advancedBox.open();
  //   panel.open();
  //   collapsedBox.open();
  // }

  // let dispatchColumns = [];
  // if (fields) {
  //   dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  // } else {
  //   dispatchColumns = [...dataTableColumns];
  // }

  // dataTableColumns = [
  //   ...dispatchColumns,
  //   {
  //     title: '',
  //     key: 'action',
  //     fixed: 'right',
  //     render: (_, record) => (
  //       <Dropdown
  //         menu={{
  //           items,
  //           onClick: ({ key }) => {
  //             switch (key) {
  //               case 'read':
  //                 handleRead(record);
  //                 break;
  //               case 'edit':
  //                 handleEdit(record);
  //                 break;

  //               case 'delete':
  //                 handleDelete(record);
  //                 break;
  //               case 'updatePassword':
  //                 handleUpdatePassword(record);
  //                 break;

  //               default:
  //                 break;
  //             }
  //             // else if (key === '2')handleCloseTask
  //           },
  //         }}
  //         trigger={['click']}
  //       >
  //         <EllipsisOutlined
  //           style={{ cursor: 'pointer', fontSize: '24px' }}
  //           onClick={(e) => e.preventDefault()}
  //         />
  //       </Dropdown>
  //     ),
  //   },
  // ];

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
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ''}`}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
            Reset
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

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;
  console.log("Data source: ", dataSource);

  const all_label = [];   // Array to store unique labels
  const all_family = [];
  const all_cpu = [];

  // Function to populate all_label, all_family, and all_cpu array
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

  const dataset_columns = [
    {
      title: 'Dataset Name',
      dataIndex: ["datasetName"],
      key: 'datasetName',
      ...getColumnSearchProps('datasetName'),
    },
  ];

  const dispatch = useDispatch();

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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
    console.log('Selected Data:', selectedData);
    fetch('http://localhost:1624/api/detector', {
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
    // ajax request after empty completing
    // setTimeout(() => {
    //   setSelectedRowKeys([]);
    //   setLoading(false);
    // }, 1000);
    setSelectedRowKeys([]);
    setLoading(false);
    // message.success('Training Successful!');
  };

  const saved = () => {
    setLoading(true);
    // const selectedData = dataSource.filter(item => selectedRowKeys.includes(item._id));
    // console.log('Selected Data:', selectedData);
    // console.log('Selected Keys: ', selectedRowKeys);

    // combine selectedData and DatasetName into a single object
    // const requestData = {
    //   datasetname: DatasetName,
    //   selectedData: selectedData,
    // };
    const requestData = [DatasetName, ...selectedRowKeys];
    // requestData.push(DatasetName);
    // requestData.push(selectedRowKeys);
    // console.log('requestData: ', requestData);
    // console.log('requestData[2]: ', requestData[2]);

    fetch('http://localhost:1624/api/detector', {
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
      message.success('Saving Successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      message.error('Saving Error!');
    });

    // ajax request after empty completing
    // setTimeout(() => {
    //   setSelectedRowKeys([]);
    //   setLoading(false);
    // }, 1000);
    setSelectedRowKeys([]);
    setLoading(false);
    // message.success('Training Successful!');
  };

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
    // handelDataTableLoad();
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };

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
    } else {
      // DATATABLE_TITLE === 'Detector1 Testing Data'
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
    }
  };

  const renderButtons = () => {
    if (DATATABLE_TITLE !== 'Dataset') {
      return [
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
          {hasSelected ? `Train ${selectedRowKeys.length} items` : 'Train'}
        </Button>,
        <Button onClick={showSaveModal} disabled={!hasSelected} key={`${uniqueId()}`}>
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
      ];
    } else {
      return [
        <Button type="primary" href='/Detector1Test' key={`${uniqueId()}`}>
          Create
        </Button>,
      ];
    }
  };

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          ...renderButtons(),
          <Tooltip title="Delete">
            <Button danger shape="circle" onClick={handleDelete} icon={<DeleteOutlined />} disabled={!hasSelected} style={{ marginRight: 15 }} />
          </Tooltip>,
          // <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} key={`${uniqueId()}`}>
          //   {hasSelected ? `Train ${selectedRowKeys.length} items` : 'Train'}
          // </Button>,
          // <Button onClick={showSaveModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          //   {hasSelected ? `Save ${selectedRowKeys.length} items` : 'Save'}
          // </Button>,
          // <Modal title="Saving Dataset" open={isModalOpen} onOk={handleSaveOk} onCancel={handleSaveCancel}>
          //   <Input 
          //     name='Dataset Name'
          //     onChange={saveInput}
          //     allowClear
          //     placeholder='enter your dataset name...'
          //   />
          // </Modal>,
          // <Button onClick={showModal} disabled={!hasSelected} key={`${uniqueId()}`}>
          //   {hasSelected ? `Edit ${selectedRowKeys.length} items` : 'Edit'}
          // </Button>,
          // <Modal
          //   title="Edit Items"
          //   open={open}
          //   onOk={handleOk}
          //   onCancel={handleCancel}
          //   okText="Edit"
          // >
          //   <Checkbox 
          //     checked={FilenameDisabled}
          //     onChange={onChangeFilename}
          //   >
          //     Filename
          //   </Checkbox>
          //   <Input 
          //     name='filename'
          //     onChange={filenameInput}
          //     disabled={!FilenameDisabled} 
          //     allowClear
          //   />

          //   <Checkbox 
          //     checked={LabelDisabled}
          //     onChange={onChangeLabel}
          //   >
          //     Label
          //   </Checkbox>
          //   <Input
          //     name='label'
          //     onChange={labelInput}
          //     disabled={!LabelDisabled}
          //     allowClear
          //   />

          //   <Checkbox 
          //     checked={FamilyDisabled}
          //     onChange={onChangeFamily}
          //   >
          //     Family
          //   </Checkbox>
          //   <Input 
          //     name='family'
          //     onChange={familyInput}
          //     allowClear
          //     disabled={!FamilyDisabled}
          //   />

          //   <Checkbox 
          //     checked={CPUDisabled}
          //     onChange={onChangeCPU}
          //   >
          //     Cpuarchitecture
          //   </Checkbox>
          //   <Input 
          //     name='cpu'
          //     onChange={cpuInput}
          //     allowClear
          //     disabled={!CPUDisabled}
          //   />

          //   <Checkbox 
          //     checked={FilesizeDisabled}
          //     onChange={onChangeFilesize}
          //   >
          //     Filesize
          //   </Checkbox>
          //   <Input 
          //     name='filesize'
          //     onChange={filesizeInput}
          //     allowClear
          //     disabled={!FilesizeDisabled}
          //   />

          //   <Checkbox 
          //     checked={TypeDisabled}
          //     onChange={onChangeType}
          //   >
          //     Type
          //   </Checkbox>
          //   {/* <Input 
          //     name='type'
          //     onChange={typeInput}
          //     allowClear
          //     disabled={!TypeDisabled}
          //   /> */}
          //   <Select
          //     onChange={typeInput}
          //     placeholder="Select a tag"
          //     style={{
          //       width: 472,
          //     }}
          //     options={[
          //       {
          //         value: 'test',
          //         label: 'test',
          //       },
          //       {
          //         value: 'train',
          //         label: 'train',
          //       },
          //       {
          //         value: 'unlearn',
          //         label: 'unlearn',
          //       },
          //       {
          //         value: 'predict',
          //         label: 'predict',
          //       },
          //     ]}
          //     allowClear
          //     disabled={!TypeDisabled}
          //   />

          // </Modal>,
          <Tooltip title="Reload">
            <Button shape="circle" onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<ReloadOutlined />} />
          </Tooltip>,
          // <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      {renderTable()}

      {/* <Table
        columns={columns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        bordered
        scroll={{ x: true }}
        rowSelection={rowSelection}
      /> */}
    </>
  );
}