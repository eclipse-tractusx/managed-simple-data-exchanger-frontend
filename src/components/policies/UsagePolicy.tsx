import { Box } from '@mui/material';
import {
  setDuration,
  setDurationValue,
  setPurpose,
  setPurposeValue,
  setRole,
  setRoleValue,
} from '../../store/accessUsagePolicySlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import UsagePolicyItem from './UsagePolicyItem';

export default function UsagePolicy() {
  const { duration, durationValue, purpose, purposeValue, role, roleValue } = useAppSelector(
    state => state.accessUsagePolicySlice,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <p>
        <b className="text-[#444444] mb-2">USAGE POLICY</b>
      </p>
      <Box sx={{ mt: 2 }}>
        <UsagePolicyItem
          restrictionType={duration}
          setRestrictionType={e => dispatch(setDuration(e))}
          constraintType="Duration"
          displayText="Usage allowed from contract start  "
          inputFreeText={durationValue}
          setInputFreeText={e => dispatch(setDurationValue(e))}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={purpose}
          setRestrictionType={e => dispatch(setPurpose(e))}
          constraintType="Purpose"
          displayText="Usage allowed only for the purpose "
          inputFreeText={purposeValue}
          setInputFreeText={e => dispatch(setPurposeValue(e))}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={role}
          setRestrictionType={e => dispatch(setRole(e))}
          constraintType="Role"
          displayText="Usage allowed only by individuals with the following roles/characteristics "
          inputFreeText={roleValue}
          setInputFreeText={e => dispatch(setRoleValue(e))}
        />
      </Box>
      {/* <Box sx={{ mt: 4 }}>
        <UsagePolicyItem
          restrictionType={custom}
          setRestrictionType={e => dispatch(setCustom(e))}
          constraintType="Custom"
          displayText="Usage must comply to the following additional conditions "
          inputFreeText={customValue}
          setInputFreeText={e => dispatch(setCustomValue(e))}
        />
      </Box> */}
    </>
  );
}
