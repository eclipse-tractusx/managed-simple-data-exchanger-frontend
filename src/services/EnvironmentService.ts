import { Config } from '../utils/config';

export const getHostname = () => window.location.hostname;

export const isLocal = () => getHostname() === 'localhost';

export const getCentralIdp = () => {
  const hostname = getHostname();
  if (hostname === 'dft-dev.germanywestcentral.cloudapp.azure.com')
    return 'https://centralidp.dev.demo.catena-x.net/auth';

  if (hostname === 'dft.int.demo.catena-x.net') return 'https://centralidp.demo.catena-x.net/auth';

  if (isLocal) return 'https://centralidp.dev.demo.catena-x.net/auth';

  return 'https://centralidp.dev.demo.catena-x.net/auth';
};

export const getClientId = () => {
  if (isLocal()) return 'Cl15-CX-DFT';
  return Config.REACT_APP_CLIENT_ID;
};

const EnvironmentService = {
  isLocal,
  getHostname,
  getCentralIdp,
  getClientId,
};

export default EnvironmentService;
