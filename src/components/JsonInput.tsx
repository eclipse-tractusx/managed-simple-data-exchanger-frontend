import { useTheme, Grid, TextareaAutosize, Box } from '@mui/material';
import { Typography, Button } from 'cx-portal-shared-components';
import { submitJsonData } from '../features/submodels/actions';
import { setJsonInputData } from '../features/submodels/slice';
import { useAppDispatch, useAppSelector } from '../store/store';

export default function JsonInput() {
  const theme = useTheme();
  const { submodelDetails, jsonInputData } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const textareaStyle = {
    width: '100%',
    border: `1px solid ${theme.palette.grey[500]}`,
    marginTop: '16px',
    padding: '16px',
    borderRadius: 4,
    fontSize: 16,
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          size="small"
          onClick={() => dispatch(submitJsonData(jsonInputData))}
          disabled={!Boolean(jsonInputData.length)}
        >
          Next Step - Configure Policies
        </Button>
      </Box>
      <Grid display={'flex'} justifyContent="center" alignContent={'center'} pt={4}>
        <Grid item xs={4}>
          <Typography variant="h4">{submodelDetails.title}</Typography>
          <TextareaAutosize
            value={jsonInputData}
            minRows={20}
            placeholder={JSON.stringify(submodelDetails.examples, undefined, 4)}
            style={{ ...textareaStyle }}
            onChange={e => {
              dispatch(setJsonInputData(e.target.value));
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
