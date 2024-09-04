import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function Detector1Test() {
  const translate = useLanguage();
  const entity = 'data';
  const searchConfig = {
    displayLabels: ['filename'],
    searchFields: 'filename,label,family,CPUArchitecture,tags',
  };
  const deleteModalLabels = ['filename'];

  const Labels = {
    PANEL_TITLE: translate('Select Your Dataset'),
    DATATABLE_TITLE: translate('Select Your Dataset'),
    ADD_NEW_ENTITY: <PlusOutlined />,
    ENTITY_NAME: translate('Detector1_test'),
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
