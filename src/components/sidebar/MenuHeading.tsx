import { Divider } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../features/store';

const MenuItemHeading = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  return (
    <>
      <Divider />
      <Typography
        variant="body1"
        sx={{
          display: !sidebarExpanded ? 'hidden' : 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          px: 2.4,
          py: 1,
        }}
      >
        {sidebarExpanded ? t(text) : t(text).charAt(0)}
      </Typography>
      <Divider />
    </>
  );
};

export default MenuItemHeading;
