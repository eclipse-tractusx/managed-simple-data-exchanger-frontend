import Keycloak from 'keycloak-js';
import { setLoggedInUser } from '../store/appSlice';
import { store } from '../store/store';
import { IUser } from '../models/User';
import { getCentralIdp, getClientId, getClientRealm } from './EnvironmentService';

const keycloakConfig: Keycloak.KeycloakConfig = {
  url: getCentralIdp(),
  realm: getClientRealm(),
  clientId: getClientId(),
};

const KC = new Keycloak(keycloakConfig);

const doLogin = KC.login;

const doLogout = KC.logout;

const getToken = () => KC.token;

const getParsedToken = () => KC.tokenParsed;

const updateToken = (successCallback?: () => void) => KC.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => KC.tokenParsed.preferred_username;

const getName = () => KC.tokenParsed?.name;

const getEmail = () => KC.tokenParsed?.email;

const getCompany = () => KC.tokenParsed?.organisation;

const getTenant = () => KC.tokenParsed?.tenant;

const hasRole = (roles: string[]) => roles.some((role: string) => KC.hasRealmRole(role));

const isLoggedIn = () => !!KC.token;

const getRoles = () => KC.tokenParsed?.resource_access[keycloakConfig.clientId]?.roles;

const getLoggedUser = () => ({
  userName: getUsername(),
  name: getName(),
  email: getEmail(),
  company: getCompany(),
  tenant: getTenant(),
  token: getToken(),
  parsedToken: getParsedToken(),
});

/**
 * Initializes Keycloak instance and calls the provided
 * callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

const initKeycloak = (onAuthenticatedCallback: (loggedUser: IUser) => unknown) => {
  KC.init({
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    pkceMethod: 'S256',
  })
    .then(authenticated => {
      if (authenticated) {
        console.log(`${getUsername()} authenticated`);
        onAuthenticatedCallback(getLoggedUser());
        store.dispatch(setLoggedInUser(getLoggedUser()));
      } else {
        doLogin();
      }
    })
    .catch(console.error);
};

// KC.onTokenExpired = () => {
//   KC.updateToken(50)
//     .then((refreshed: boolean) => {
//       console.log(`${getUsername()} refreshed ${refreshed}`);
//       store.dispatch(setLoggedInUser(getLoggedUser()));
//     })
//     .catch(() => {
//       console.log(`${getUsername()} refresh failed`);
//     });
// };

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  getEmail,
  hasRole,
  getLoggedUser,
  getRoles,
};

export default UserService;
