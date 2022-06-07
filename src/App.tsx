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

import Login from './pages/Login';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, AuthRoute } from './modules/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorage } from './modules/LocalStorage';

function App() {
  const [isAuth, setIsAuth] = useLocalStorage('auth', false);
  const [isAuthError, setIsAuthError] = useState(false);
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuth={setIsAuth} setIsAuthError={setIsAuthError} isAuthError={isAuthError} />}
        />
        <Route path="/" element={<AuthRoute isAuth={isAuth} />}></Route>
        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route key="upload-file" path="/dashboard/upload-file" element={<Dashboard />} />
          <Route key="create-data" path="/dashboard/create-data" element={<Dashboard />} />
          <Route key="history" path="/dashboard/history" element={<Dashboard />} />
          <Route key="help" path="/dashboard/help" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/upload-file" />}></Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
