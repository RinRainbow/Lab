import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function UnlearnEdit() {
  const translate = useLanguage();
  const entity = 'dataset';
  const searchConfig = {
    displayLabels: ['filename'],
    searchFields: 'filename,label,family,CPUArchitecture,tags',
  };
  const deleteModalLabels = ['filename'];

  const Labels = {
    PANEL_TITLE: translate('Unlearn Edit'),
    DATATABLE_TITLE: translate('Unlearn Edit'),
    ADD_NEW_ENTITY: <PlusOutlined />,
    ENTITY_NAME: translate('UnlearnEdit'),
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
