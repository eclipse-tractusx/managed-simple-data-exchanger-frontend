import React from 'react';
import { Grid, Typography } from '@mui/material';

const ContractHistory: React.FC = () => {
  return (
    <div className="flex-1 py-6 px-10">
      <Grid container spacing={2}>
        <Grid item xs={12} my={4}>
          <Typography variant="h4">Contract History</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContractHistory;
