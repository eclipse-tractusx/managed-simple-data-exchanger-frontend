import { Config } from '../utils/config';

export const getCentralIdp = () => Config.REACT_APP_KEYCLOAK_URL;

export const getClientId = () => Config.REACT_APP_CLIENT_ID;

export const getClientRealm = () => Config.REACT_APP_KEYCLOAK_REALM;

const EnvironmentService = {
  getCentralIdp,
  getClientRealm,
  getClientId,
};

export default EnvironmentService;
