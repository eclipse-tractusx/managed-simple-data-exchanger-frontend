import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { fetchSubmodelDetails, fetchSubmodelList } from '../features/submodels/actions';
import { setSelectedSubmodel } from '../features/submodels/slice';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function SelectSubmodel() {
  const { selectedSubmodel, submodelList } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();

  const handleTypeChange = async (event: SelectChangeEvent) => {
    dispatch(setSelectedSubmodel(event.target.value as string));
    dispatch(fetchSubmodelDetails(event.target.value as string));
  };

  useEffect(() => {
    dispatch(fetchSubmodelList());
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Select Submodel</InputLabel>
      <Select value={selectedSubmodel || ''} label="Select Submodel" onChange={handleTypeChange}>
        {submodelList?.map((e: string, i: number) => (
          <MenuItem key={i} value={e}>
            {e}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
