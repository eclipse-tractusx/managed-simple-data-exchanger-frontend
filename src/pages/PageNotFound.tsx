import { Box } from '@mui/material';

export default function PageNotFound() {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box>Page Not Found</Box>
      <Box>
        <a href="/" style={{ color: 'blue', fontSize: 13, textDecoration: 'underline' }}>
          Go home
        </a>
      </Box>
    </Box>
  );
}
