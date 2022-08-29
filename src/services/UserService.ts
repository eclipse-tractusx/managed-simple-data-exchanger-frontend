import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { getCentralIdp, getClientId } from './EnvironmentService';

export interface IUser {
  userName: string;
  name: string;
  email: string;
  company: string;
  tenant: string;
  token: string;
  parsedToken: KeycloakTokenParsed;
}

const keycloakConfig: Keycloak.KeycloakConfig = {
  url: getCentralIdp(),
  realm: 'CX-Central',
  clientId: getClientId(),
};

const KC = new Keycloak(keycloakConfig);

/**
 * Initializes Keycloak instance and calls the provided
 * callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

const doLogin = KC.login;

const doLogout = KC.logout;

const getToken = () => KC.token;

const getParsedToken = () => KC.tokenParsed;

const updateToken = () => KC.updateToken(50).catch(doLogin);

const getUsername = () => KC.tokenParsed.preferred_username;

const getName = () => KC.tokenParsed?.name;

const getEmail = () => KC.tokenParsed?.email;

const getCompany = () => KC.tokenParsed?.organisation;

const getTenant = () => KC.tokenParsed?.tenant;

const hasRole = (roles: string[]) => roles.some((role: string) => KC.hasRealmRole(role));

const isLoggedIn = () => !!KC.token;

const getLoggedUser = () => ({
  userName: getUsername(),
  name: getName(),
  email: getEmail(),
  company: getCompany(),
  tenant: getTenant(),
  token: getToken(),
  parsedToken: getParsedToken(),
});

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
      } else {
        doLogin();
      }
    })
    .catch(console.error);
};

KC.onTokenExpired = () => {
  KC.updateToken(50)
    .then((refreshed: boolean) => {
      console.log(`${getUsername()} refreshed ${refreshed}`);
      //TODO: update token in redux store
      //store.dispatch(setLoggedUser(getLoggedUser()))
    })
    .catch(() => {
      console.log(`${getUsername()} refresh failed`);
    });
};

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
};

export default UserService;
