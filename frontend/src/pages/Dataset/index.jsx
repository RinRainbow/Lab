import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function Dataset() {
  const translate = useLanguage();
  const entity = 'datasetname';
  const searchConfig = {
    displayLabels: ['datsetName'],
    searchFields: 'datasetName',
  };
  const deleteModalLabels = ['datasetName'];

  const Labels = {
    PANEL_TITLE: translate('Dataset'),
    DATATABLE_TITLE: translate('Dataset'),
    ADD_NEW_ENTITY: <PlusOutlined />,
    ENTITY_NAME: translate('Dataset'),
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
