import { ErrorPage } from 'cx-portal-shared-components';
import App from './App';
import { IUser } from './models/User';
import { Config } from './utils/config';

export default function Root({ loggedInUser }: { loggedInUser: IUser }) {
  const access = loggedInUser?.parsedToken?.resource_access;
  return (
    <>
      {!access?.hasOwnProperty(Config.REACT_APP_CLIENT_ID) ? (
        <App />
      ) : (
        <ErrorPage header="This webpage is not available." title="Sorry for this inconvenience." />
      )}
    </>
  );
}
