import { Provider } from 'react-redux';
import { store } from '../store/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ReduxWrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
