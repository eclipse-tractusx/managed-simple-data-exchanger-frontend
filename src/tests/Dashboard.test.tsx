// Copyright 2022 Catena-X
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { handleDialogOpen } from '../store/accessUsagePolicySlice';
import { store } from '../store/store';
import { ReduxWrapper } from '../utils/testUtils';

describe('Dashboard', () => {
  test('upload file page', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/dashboard/create-data' }]}>
        <Dashboard />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    expect(screen.getByText('Drag and drop your file on this page')).toBeInTheDocument();
    expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
    expect(screen.queryByText('Rules')).not.toBeInTheDocument();
  });

  test('upload history page', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/dashboard/history' }]}>
        <Dashboard />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  test('help page', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/dashboard/help' }]}>
        <Dashboard />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  test('Render Policies Dialog Componenet', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/dashboard/create-data' }]}>
        <Dashboard />
      </MemoryRouter>,
      { wrapper: ReduxWrapper },
    );
    store?.dispatch(handleDialogOpen(true));
    expect(screen.queryByText('Policies')).toBeInTheDocument();
  });
});
