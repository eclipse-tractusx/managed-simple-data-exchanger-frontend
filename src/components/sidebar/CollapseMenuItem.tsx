import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { theme } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { setSidebarExpanded } from '../../features/app/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json');

export default function CollapseMenuItem() {
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <>
      <ListItem sx={{ px: sidebarExpanded ? 2 : '6px' }}>
        {sidebarExpanded ? `SDE v${version}` : `v${version}`}
      </ListItem>
      <ListItem onClick={() => dispatch(setSidebarExpanded())} sx={{ p: 0 }}>
        <ListItemButton sx={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            sx={{
              minWidth: 30,
            }}
          >
            {sidebarExpanded ? (
              <KeyboardDoubleArrowLeftIcon fontSize="small" sx={{ color: theme.palette.common.black }} />
            ) : (
              <KeyboardDoubleArrowRightIcon fontSize="small" sx={{ color: theme.palette.common.black }} />
            )}
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: {
                fontSize: '14px',
                color: theme.palette.common.black,
              },
            }}
            primary={t('content.common.collapseSidebar')}
            sx={{ opacity: open ? 1 : 0, display: !sidebarExpanded ? 'none' : 'flex' }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}
