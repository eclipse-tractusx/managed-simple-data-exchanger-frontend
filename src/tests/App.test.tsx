/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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

import { Help } from '@mui/icons-material';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import UploadFile from '../components/UploadFile';
import { setPolicyDialog } from '../features/provider/policies/slice';
import { store } from '../features/store';
import CreateData from '../pages/CreateData';
import UploadHistoryNew from '../pages/UploadHistoryNew';
import { ReduxWrapper } from '../utils/testUtils';

describe('Dashboard', () => {
  test('upload file page', () => {
    render(<UploadFile />, { wrapper: ReduxWrapper });
    expect(screen.getByText('Upload a file')).toBeInTheDocument();
  });

  test('upload history page', () => {
    const { container } = render(<UploadHistoryNew />, { wrapper: ReduxWrapper });
    container.querySelector('.upload-title');
    expect(container.firstChild).toMatchSnapshot();
  });

  test('help page', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/help' }]}>
        <Help />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  test('Render Policies Dialog Componenet', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/create-data' }]}>
        <CreateData />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    store?.dispatch(setPolicyDialog(true));
    expect(screen.queryByText('Policies')).toBeInTheDocument();
  });
});
