import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { DefinedError } from 'ajv/dist/core';
import { store } from '../store/store';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { GridValidRowModel } from '@mui/x-data-grid';
import { handleDialogOpen } from '../features/policies/slice';

export const schemaValidator = async (data: GridValidRowModel[]) => {
  const ajv = new Ajv2019();
  addFormats(ajv);

  const submodelSlice = store.getState().submodelSlice;
  const validate = ajv.compile(submodelSlice.submodelDetails.items);
  const result: boolean[] = [];
  data.forEach((item: GridValidRowModel, index: number) => {
    const valid = validate(item);
    if (valid) {
      result.push(true);
    } else {
      result.push(false);
      const errors = [];
      for (const err of validate.errors as DefinedError[]) {
        errors.push(err.message);
        store.dispatch(
          setSnackbarMessage({
            message: `Row ${index + 1}: ${err.instancePath.replace(/[^a-zA-Z ]/g, ' ')} ${err.message}`,
            type: 'error',
          }),
        );
      }
    }
  });
  if (!result.includes(false)) {
    store.dispatch(handleDialogOpen({ data: data, url: submodelSlice.selectedSubmodel, type: 'json' }));
  }
};
