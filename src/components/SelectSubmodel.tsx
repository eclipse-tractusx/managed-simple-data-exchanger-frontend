import { SelectList } from 'cx-portal-shared-components';
import { useEffect } from 'react';

import { fetchSubmodelDetails, fetchSubmodelList } from '../features/submodels/actions';
import { setSelectedSubmodel } from '../features/submodels/slice';
import { ISubmodelList } from '../features/submodels/types';
import { useAppDispatch, useAppSelector } from '../store/store';

const SelectSubmodel = () => {
  const { submodelList, selectedSubmodel } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();

  const handleTypeChange = async (item: ISubmodelList) => {
    dispatch(setSelectedSubmodel(item));
    dispatch(fetchSubmodelDetails(item.value));
  };

  useEffect(() => {
    dispatch(fetchSubmodelList());
    dispatch(fetchSubmodelDetails(selectedSubmodel.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SelectList
      keyTitle="title"
      label="Select Submodel"
      fullWidth
      size="small"
      defaultValue={selectedSubmodel}
      onChangeItem={e => handleTypeChange(e)}
      items={submodelList}
      placeholder="Select Submodel"
      hiddenLabel
      disableClearable={true}
    />
  );
};

export default SelectSubmodel;
