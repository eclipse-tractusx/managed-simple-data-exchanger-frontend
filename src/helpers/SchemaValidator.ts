import Ajv from 'ajv';
import { JTDDataType } from 'ajv/dist/core';

export default function schemaValidator(schema: JTDDataType<unknown>, data: unknown) {
  console.log(schema, data);
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) console.log(validate.errors);
  return valid;
}
