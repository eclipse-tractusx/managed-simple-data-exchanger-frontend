import { ErrorPage } from 'cx-portal-shared-components';
import React from 'react';
import App from './App';
import { useAppSelector } from './store/store';

const Root: React.FC = () => {
  const { isUserValid } = useAppSelector(state => state.appSlice);
  return (
    <>
      {isUserValid ? (
        <App />
      ) : (
        <ErrorPage header="This webpage is not available." title="Sorry for this inconvenience." />
      )}
    </>
  );
};

export default Root;
