import { SelectList } from 'cx-portal-shared-components';
import { useEffect } from 'react';

import { fetchSubmodelDetails, fetchSubmodelList } from '../features/submodels/actions';
import { setSelectedSubmodel } from '../features/submodels/slice';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function SelectSubmodel() {
  const { submodelList } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();

  const handleTypeChange = async (value: string) => {
    dispatch(setSelectedSubmodel(value));
    dispatch(fetchSubmodelDetails(value));
  };

  const defaultValue = {
    id: 0,
    title: 'Serial Part Typizations',
    value: 'aspect',
  };

  useEffect(() => {
    dispatch(fetchSubmodelList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SelectList
      keyTitle="title"
      label="Select Submodel"
      fullWidth
      size="small"
      defaultValue={defaultValue}
      onChangeItem={e => handleTypeChange(e ? e.value : '')}
      items={submodelList}
      placeholder="Select Submodel"
      hiddenLabel
      disableClearable={true}
    />
  );
}
