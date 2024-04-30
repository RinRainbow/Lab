import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Testingboo() {
  const translate = useLanguage();
  const entity = 'dataset';
  const searchConfig = {
    displayLabels: ['filename'],
    searchFields: 'filename,label,family',
  };
  const deleteModalLabels = ['firstname', 'lastname'];

  const Labels = {
    PANEL_TITLE: translate('testingpo0'),
    DATATABLE_TITLE: translate('testingboo'),
    ADD_NEW_ENTITY: translate('add_new_testdata'),
    ENTITY_NAME: translate('person'),
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