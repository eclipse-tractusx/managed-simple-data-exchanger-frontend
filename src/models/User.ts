import { KeycloakTokenParsed } from 'keycloak-js';

export interface IUser {
  userName: string;
  name: string;
  email: string;
  company: string;
  tenant: string;
  token: string;
  parsedToken: KeycloakTokenParsed;
}
