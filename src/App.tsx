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

import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import PageLoading from './components/PageLoading';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/create-data" />}></Route>
          <Route path="/dashboard" element={<Navigate to="/dashboard/create-data" />}></Route>
          <Route key="create-data" path="/dashboard/create-data" element={<Dashboard />} />
          <Route key="history" path="/dashboard/history" element={<Dashboard />} />
          <Route key="help" path="/dashboard/help" element={<Dashboard />} />
          <Route key="consume-data" path="/dashboard/consume-data" element={<Dashboard />} />
          <Route key="contract-history" path="/dashboard/contract-history" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      <PageLoading />
    </div>
  );
}

export default App;
