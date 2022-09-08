import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Config } from '../utils/config';

interface ManageBpnProps {
  bpnList: string[];
  setBpnList: (data: string[]) => void;
}
export const ManageBpn: React.FC<ManageBpnProps> = ({ bpnList, setBpnList }) => {
  const [inputBpn, setInputBpn] = React.useState<string>('');
  const defaultCompanyBPN = Config.REACT_APP_DEFAULT_COMPANY_BPN;
  const addBpn = () => {
    if (inputBpn) {
      setBpnList([...bpnList, inputBpn]);
      setInputBpn('');
    }
  };

  const deleteBpn = (bpnNum: string) => setBpnList(bpnList.filter(item => item !== bpnNum));
  React.useEffect(() => {
    localStorage.setItem('persistedBpnList', JSON.stringify(bpnList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpnList]);
  return (
    <Box>
      <Grid item xs={12}>
        <TextField
          label="Enter BPN"
          variant="outlined"
          size="small"
          value={inputBpn}
          onChange={e => setInputBpn(e.target.value)}
        />
        <Button variant="contained" sx={{ marginLeft: 1 }} onClick={addBpn}>
          Add
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ minWidth: 260, marginTop: 1 }}>
          <CardContent>
            <List style={{ maxHeight: 200, overflow: 'auto' }} dense>
              {bpnList.map((bpnNum: string, key: number) => (
                <ListItem
                  divider
                  disablePadding
                  key={key}
                  secondaryAction={
                    bpnNum !== defaultCompanyBPN && (
                      <IconButton onClick={() => deleteBpn(bpnNum)} edge="end" aria-label="delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText primary={bpnNum} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};
