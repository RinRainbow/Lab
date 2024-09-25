import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function Unlearn() {
  const translate = useLanguage();
  const entity = 'modelsetting';
  const searchConfig = {
    displayLabels: ['modelName'],
    searchFields: 'modelName',
  };
  const deleteModalLabels = ['modelName'];

  const Labels = {
    PANEL_TITLE: translate('Unlearn'),
    DATATABLE_TITLE: translate('Unlearn'),
    ADD_NEW_ENTITY: <PlusOutlined />,
    ENTITY_NAME: translate('Unlearn'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}


  // <div className='button set' style={{padding: '30px 30px 0px 0px'}}>
  //   <Flex justify="flex-end" gap="small" wrap>
  //     <Button type="primary">Unlearn</Button>
  //   </Flex>
  // </div>