import { ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../features/store';
import { icons, IntMenuItem } from '../../helpers/SidebarHelper';
import Permissions from '../Permissions';

export default function MenuItem({ item }: { item: IntMenuItem }) {
  const theme = useTheme();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { menuIcon, to, text, dataId } = item;
  const Icon = icons[menuIcon];
  return (
    <Permissions values={item.permissions}>
      <ListItem data-testid={dataId} onClick={() => navigate(to)} sx={{ p: 0 }}>
        <ListItemButton sx={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            sx={{
              minWidth: 30,
            }}
          >
            <Icon
              fontSize="small"
              sx={{
                color: `${location.pathname === to ? theme.palette.primary.main : theme.palette.common.black}`,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: {
                fontSize: '14px',
                color: `${location.pathname === to ? theme.palette.primary.main : theme.palette.common.black}`,
              },
            }}
            primary={t(text)}
            sx={{
              opacity: open ? 1 : 0,
              display: !sidebarExpanded ? 'none' : 'flex',
            }}
          />
        </ListItemButton>
      </ListItem>
    </Permissions>
  );
}
