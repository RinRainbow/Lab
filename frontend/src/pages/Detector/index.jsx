import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function Detector() {
  const translate = useLanguage();
  const entity = 'model';
  const searchConfig = {
    displayLabels: ['modelName'],
    searchFields: 'modelName',
  };
  const deleteModalLabels = ['modelName'];

  const Labels = {
    PANEL_TITLE: translate('Detector'),
    DATATABLE_TITLE: translate('Detector'),
    ADD_NEW_ENTITY: <PlusOutlined />,
    ENTITY_NAME: translate('Detector'),
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


{/* <Button type="primary">Train</Button>
<Button href='/detectorSetting'>Create</Button>
<Button danger>Delete</Button> */}