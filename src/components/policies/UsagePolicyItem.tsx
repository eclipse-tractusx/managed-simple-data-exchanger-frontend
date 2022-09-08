import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { setDurationUnit } from '../../store/accessUsagePolicySlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

interface FreeTextProps {
  restrictionType: string;
  setRestrictionType: (restrictionType: string) => void;
  constraintType: string;
  displayText: string;
  inputFreeText: string;
  setInputFreeText: (freeText: string) => void;
}

export default function UsagePolicyItem({
  restrictionType,
  setRestrictionType,
  constraintType,
  displayText,
  inputFreeText,
  setInputFreeText,
}: FreeTextProps) {
  const { durationUnit } = useAppSelector(state => state.accessUsagePolicySlice);
  const dispatch = useAppDispatch();
  const durationUnits = [
    {
      label: 'Second',
      value: 'SECOND',
    },
    {
      label: 'Minute',
      value: 'MINUTE',
    },
    {
      label: 'Hour',
      value: 'HOUR',
    },
    {
      label: 'Day',
      value: 'DAY',
    },
    {
      label: 'Month',
      value: 'MONTH',
    },
    {
      label: 'Year',
      value: 'YEAR',
    },
  ];
  function checkErrors() {
    if (constraintType === 'Duration') {
      console.log(constraintType);
      const result = /^[1-9]\d*$/.test(inputFreeText);
      console.log(result);
      return !result;
    } else if (restrictionType === 'RESTRICTED' && inputFreeText === '') {
      return true;
    }
  }
  return (
    <Box component="form" noValidate autoComplete="off">
      <FormLabel className="text-2xl text-[#444444] mb-4">
        <b>{constraintType} restriction</b>
      </FormLabel>
      <RadioGroup row value={restrictionType} onChange={e => setRestrictionType(e.target.value)}>
        <FormControlLabel value="UNRESTRICTED" control={<Radio />} label="Unrestricted" />
        <FormControlLabel value="RESTRICTED" control={<Radio />} label="Restricted" />
      </RadioGroup>

      <Box>
        {restrictionType === 'RESTRICTED' && (
          <>
            <FormLabel sx={{ my: 1, display: 'block' }}>{displayText}</FormLabel>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Enter a value"
                variant="outlined"
                size="small"
                type={constraintType === 'Duration' ? 'number' : 'text'}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                value={inputFreeText}
                required
                error={checkErrors()}
                onChange={e => {
                  setInputFreeText(e.target.value);
                }}
              />
              {constraintType === 'Duration' && (
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <Select
                    value={durationUnit}
                    onChange={e => {
                      dispatch(setDurationUnit(e.target.value));
                    }}
                  >
                    {durationUnits.map(item => (
                      <MenuItem key={item.label} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}
