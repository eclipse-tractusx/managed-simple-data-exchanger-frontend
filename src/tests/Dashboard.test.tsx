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

test('dashboard - upload file menu', () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );

  const uploadFileMenu = screen.getByTestId('uploadFileMenu');
  uploadFileMenu.click();
  expect(screen.getByText('Drag and drop your file on this page')).toBeInTheDocument();
  expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
  expect(screen.queryByText('Rules')).not.toBeInTheDocument();
});

test('dashboard - upload history menu', () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );

  const uploadHistoryMenu = screen.getByTestId('uploadHistoryMenu');
  uploadHistoryMenu.click();
  expect(screen.getByText('Refresh')).toBeInTheDocument();
  expect(screen.queryByText('Drag and drop your file on this page')).not.toBeInTheDocument();
  expect(screen.queryByText('Rules')).not.toBeInTheDocument();
});

test('dashboard - help menu', () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );

  const helpMenu = screen.getByTestId('helpMenu');
  helpMenu.click();
  expect(screen.getByText('Rules')).toBeInTheDocument();
  expect(screen.queryByText('Drag and drop your file on this page')).not.toBeInTheDocument();
  expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
});
