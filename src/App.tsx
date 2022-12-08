/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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

import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PageLoading from './components/PageLoading';
import { fetchUserPermissions } from './features/app/actions';
import Notification from './features/notifiication';
import ConsumeData from './pages/ConsumeData';
import ContractHistory from './pages/ContractHistory';
import CreateData from './pages/CreateData';
import Help from './pages/Help';
import PageNotFound from './pages/PageNotFound';
import UploadHistory from './pages/UploadHistory';
import { useAppDispatch } from './store/store';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserPermissions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/create-data" />}></Route>
        <Route key="create-data" path="/create-data" element={<CreateData />} />
        <Route key="upload-history" path="/upload-history" element={<UploadHistory />} />
        <Route key="help" path="/help" element={<Help />} />
        <Route key="consume-data" path="/consume-data" element={<ConsumeData />} />
        <Route key="contract-history" path="/contract-history" element={<ContractHistory />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Notification />
      <PageLoading />
    </>
  );
}

export default App;
