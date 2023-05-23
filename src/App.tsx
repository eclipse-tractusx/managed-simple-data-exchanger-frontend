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

import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PageLoading from './components/PageLoading';
import Permissions from './components/Permissions';
import { IUser } from './features/app/types';
import Notification from './features/notifiication';
import { IRoutes, ROUTES } from './helpers/RouteHelper';
import Main from './Main';

export default function App({ loggedUser }: { loggedUser: IUser }) {
  return (
    <BrowserRouter>
      <Suspense fallback={''}>
        <Routes>
          <Route path="/" element={<Main loggedUser={loggedUser} />}>
            {ROUTES.map((route: IRoutes) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Permissions values={route.permissions} fullPage={true}>
                    {route.element}
                  </Permissions>
                }
              ></Route>
            ))}
          </Route>
        </Routes>
      </Suspense>
      <Notification />
      <PageLoading />
    </BrowserRouter>
  );
}
