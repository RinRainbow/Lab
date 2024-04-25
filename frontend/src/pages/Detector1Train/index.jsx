import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Detector1_train() {
  const translate = useLanguage();
  const entity = 'Detector1_train';
  const searchConfig = {
    displayLabels: ['filename'],
    searchFields: 'filename, label, family',
  };
  const deleteModalLabels = ['firstname, lastname'];

  const Labels = {
    PANEL_TITLE: 'Detector1 Training Data',
    DATATABLE_TITLE: 'Detector1 Training Data',
    ADD_NEW_ENTITY: 'add',
    ENTITY_NAME: 'Detector1_train',
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
