import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function NoDataPlaceholder(text: string) {
  const { t } = useTranslation();
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {t(text)}
    </Stack>
  );
}
