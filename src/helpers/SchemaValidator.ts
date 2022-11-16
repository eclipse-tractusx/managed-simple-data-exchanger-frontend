/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { DefinedError } from 'ajv/dist/core';
import { store } from '../store/store';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { handleDialogOpen } from '../store/accessUsagePolicySlice';

export default function schemaValidator(data: any) {
  const ajv = new Ajv2019();
  addFormats(ajv);

  const submodelSlice = store.getState().submodelSlice;
  const validate = ajv.compile(submodelSlice.submodelDetails.items);

  data.forEach((item: any, index: number) => {
    const valid = validate(item);
    if (valid) {
      // data is MyData here
      console.log('valid data', data);
      store.dispatch(handleDialogOpen({ data: data, url: submodelSlice.selectedSubmodel, type: 'json' }));
    } else {
      // The type cast is needed, as Ajv uses a wider type to allow extension
      // You can extend this type to include your error types as needed.
      console.log(validate.errors);
      const errors = [];
      for (const err of validate.errors as DefinedError[]) {
        console.log(index + 1, err.message);
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
}
