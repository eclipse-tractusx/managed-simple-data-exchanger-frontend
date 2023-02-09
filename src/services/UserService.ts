/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import Keycloak from 'keycloak-js';

import { IUser } from '../features/app/types';
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

const getUsername = () => KC.tokenParsed?.preferred_username;

const getName = () => KC.tokenParsed?.name;

const getEmail = () => KC.tokenParsed?.email;

const getCompany = () => KC.tokenParsed?.organisation;

const getBpn = () => KC.tokenParsed?.bpn;

const getTenant = () => KC.tokenParsed?.tenant;

const hasRole = (roles: string[]) => roles.some((role: string) => KC.hasRealmRole(role));

const isLoggedIn = () => !!KC.token;

const hasValidResource = () => KC.tokenParsed?.resource_access?.hasOwnProperty(keycloakConfig.clientId);

const getLoggedUser = () => ({
  userName: getUsername(),
  name: getName(),
  email: getEmail(),
  company: getCompany(),
  bpn: getBpn(),
  tenant: getTenant(),
  token: getToken(),
  parsedToken: getParsedToken(),
});

const update = () => {
  KC.updateToken(50)
    .then((refreshed: boolean) => {
      if (refreshed) console.log(`${getUsername()} token refreshed ${refreshed}`);
    })
    .catch(() => {
      console.log(`${getUsername()} token refresh failed`);
    });
};

const initKeycloak = (onAuthenticatedCallback: (loggedUser: IUser) => unknown) => {
  KC.init({
    onLoad: 'login-required',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    pkceMethod: 'S256',
  })
    .then(authenticated => {
      if (authenticated) {
        onAuthenticatedCallback(getLoggedUser());
        setInterval(update, 50000);
      } else {
        doLogin();
      }
    })
    .catch(console.error);
};

KC.onTokenExpired = () => {
  console.log(`${getUsername()} token expired`);
  update();
};

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getParsedToken,
  updateToken,
  getUsername,
  getEmail,
  hasRole,
  getLoggedUser,
  hasValidResource,
};

export default UserService;
