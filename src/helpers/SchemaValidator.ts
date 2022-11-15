import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { DefinedError, JTDDataType } from 'ajv/dist/core';
import { GridValidRowModel } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function schemaValidator(schema: JTDDataType<any>, data: GridValidRowModel[]) {
  console.log('data', data);
  const ajv = new Ajv2019();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  data.forEach((item, index) => {
    const valid = validate(item);
    console.log('validate', valid);
    if (valid) {
      // data is MyData here
      console.log('valid data', data);
    } else {
      // The type cast is needed, as Ajv uses a wider type to allow extension
      // You can extend this type to include your error types as needed.
      console.log(validate.errors);
      for (const err of validate.errors as DefinedError[]) {
        console.log(index + 1, err.message);
      }
    }
  });
}
