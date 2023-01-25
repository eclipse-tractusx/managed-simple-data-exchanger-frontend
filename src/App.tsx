/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PageLoading from './components/PageLoading';
import Notification from './features/notifiication';
import Main from './Main';
import { IUser } from './models/User';
import ConsumeData from './pages/ConsumeData';
import ContractHistory from './pages/ContractHistory';
import CreateData from './pages/CreateData';
import Help from './pages/Help';
import Home from './pages/Home';
import Logout from './pages/Logout';
import PageNotFound from './pages/PageNotFound';
import UploadHistory from './pages/UploadHistory';

function App({ loggedUser }: { loggedUser: IUser }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main loggedUser={loggedUser} />}>
            <Route key="home" path="/" element={<Home />}></Route>
            <Route key="create-data" path="/create-data" element={<CreateData />} />
            <Route key="upload-history" path="/upload-history" element={<UploadHistory />} />
            <Route key="help" path="/help" element={<Help />} />
            <Route key="consume-data" path="/consume-data" element={<ConsumeData />} />
            <Route key="contract-history" path="/contract-history" element={<ContractHistory />} />
            <Route key="logout" path="/logout" element={<Logout />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
        <Notification />
        <PageLoading />
      </BrowserRouter>
    </>
  );
}

export default App;
