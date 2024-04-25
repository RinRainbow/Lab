import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Detector1Valid() {
  const translate = useLanguage();
  const entity = 'Detector1Valid';
  const searchConfig = {
    displayLabels: ['filename'],
    searchFields: 'filename, label, family',
  };
  const deleteModalLabels = ['firstname, lastname'];

  const Labels = {
    PANEL_TITLE: translate('Detector1 Validation Data'),
    DATATABLE_TITLE: translate('Detector1 Validation Data'),
    ADD_NEW_ENTITY: translate('add'),
    ENTITY_NAME: translate('Detector1_valid'),
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
