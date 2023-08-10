import { Grid } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { IUsageControl } from '../../features/consumer/types';

function UsagePolicies({ usagePolicies }: { usagePolicies: IUsageControl[] }) {
  const { t } = useTranslation();
  return (
    <>
      {usagePolicies.length ? (
        usagePolicies.map(item => (
          <Grid item xs={6} sx={{ mb: 1 }} key={item.type}>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {item.type.toLowerCase()}
            </Typography>
            <Typography variant="body2">
              {t('dialog.offerDetails.type')}:<strong>{item.typeOfAccess}</strong>
            </Typography>

            {item.typeOfAccess.toLowerCase() !== 'unrestricted' && (
              <>
                <Typography variant="body2">
                  {t('dialog.offerDetails.value')}:
                  <strong>
                    {item.value || '-'} {item.durationUnit}
                  </strong>
                </Typography>
              </>
            )}
          </Grid>
        ))
      ) : (
        <Typography variant="body2">Not Available</Typography>
      )}
    </>
  );
}

export default UsagePolicies;
