import { useCallback, useEffect } from 'react';
import React, { useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, message, Space, Select, TreeSelect, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems, selectSearchedItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

function DropdownItems() {

  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  const items = [
    {
      label: 'Training Data',
      key: '1',
    },
    {
      label: 'Validation Data',
      key: '2',
    },
    {
      label: 'Testing Data',
      key: '3',
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Space wrap>
      <Dropdown menu={menuProps}>
        <Button>
        <Space>
            <FilterOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
}

function Filter() {

  const options = [
    {
      label: 'Train',
      value: 'Train',
    },
    {
      label: 'Test',
      value: 'Test',
    },
    {
      label: 'All',
      value: 'All',
    },
  ];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Space
      style={{
        width: '100%',
      }}
      direction="vertical"
    >
      <Select
        mode="multiple"
        //allowClear
        style={{
          width: '100%',
        }}
        placeholder="Please select"
        defaultValue={['All']}
        onChange={handleChange}
        options={options}
      />
    </Space>
  );
}

function SelectTree({ config }) {

  const treeData = [
    {
      value: 'All',
      title: 'All',
      children: [
        {
          value: 'Data Type',
          title: 'Data Type',
          children: [
            {
              value: 'Training Data',
              title: 'Training Data',
            },
            {
              value: 'Testing Data',
              title: 'Testing Data',
            },
          ],
        },
        {
          value: 'Lable',
          title: 'Lable',
          children: [
            {
              value: 'malware',
              title: 'malware',
            },
            {
              value: 'benignware',
              title: 'benignware',
            },
          ],
        },
        {
          value: 'Family',
          title: 'Family',
          children: [
            {
              value: 'mirai',
              title: 'mirai',
            },
            {
              value: 'gafgyt',
              title: 'gafgyt',
            },
            {
              value: 'dofloo',
              title: 'dofloo',
            },
          ],
        },
        {
          value: 'Cpuarchitecture',
          title: 'Cpuarchitecture',
          children: [
            {
              value: 'PowerPC',
              title: 'PowerPC',
            },
            {
              value: 'MIPS',
              title: 'MIPS',
            },
            {
              value: 'ARM',
              title: 'ARM',
            },
          ],
        },
      ],
    },
  ];

  const [value, setValue] = useState();
  const onChange = (newValue) => {
    message.info(`Click on ${newValue}`);
    console.log(newValue);
    setValue(newValue);
  };

  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;


  
  
  return (
    
    <TreeSelect
      showSearch
      style={{
        minWidth: 200,
        width: '100%',
      }}
      value={value}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder="Please select"
      defaultValue={['All']}
      multiple
      treeDefaultExpandAll
      onChange={onChange}
      treeData={treeData}
      //onClick={handelClick} type="primary"
    />
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
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  dataTableColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
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

                case 'delete':
                  handleDelete(record);
                  break;
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

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { result: searchResult, isLoading: searchIsLoading } = useSelector(selectSearchedItems);
  //console.log('Redux state listResult:', listResult);
  //console.log('Redux state isLoading:', listIsLoading);

  //const { pagination, items: dataSource } = listResult;
  const dataSource = searchResult.length ? searchResult : listResult.items;
  const pagination = searchResult.length ? {} : listResult.pagination;
  console.log('Data source:', dataSource);

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    console.log('handleDataTableLoad');
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e) => {
    const value = e.target.value;
    console.log(value);
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    console.log(options);
    dispatch(crud.search({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
    console.log('dispatcher entity:', entity);
  };

  useEffect(() => {
    console.log('useEffect');
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
          />,
          //<Filter/>,
          <SelectTree key={`${uniqueId()}`} config={config} />,
          //<DropdownItems/>,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
            <ReloadOutlined />
          </Button>,
          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading || searchIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
