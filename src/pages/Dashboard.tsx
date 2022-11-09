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

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import { Help } from './Help';
import UploadHistory from './UploadHistory';
import CreateData from './CreateData';
import { ConsumeData } from './ConsumeData';
import ContractHistory from './ContractHistory';
import PoliciesDialog from '../components/policies/PoliciesDialog';
import { Box } from '@mui/material';

export default function Dashboard() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  const layout = () => {
    switch (location.pathname) {
      case '/dashboard/create-data':
        return (
          <>
            <CreateData />
            <PoliciesDialog />
          </>
        );
      case '/dashboard/history':
        return <UploadHistory />;
      case '/dashboard/help':
        return <Help />;
      case '/dashboard/consume-data':
        return <ConsumeData />;
      case '/dashboard/contract-history':
        return <ContractHistory />;
      default:
        break;
    }
  };
  return (
    <Box sx={{ my: 0, mx: 'auto', overflowY: 'auto', overflowX: 'hidden', height: '100vh' }}>
      <Box>
        <Nav getIsExpanded={(expanded: boolean) => handleExpanded(expanded)} />
        <Box sx={{ display: 'flex', mt: 8, height: `calc(100vh - 64px)`, overflow: 'hidden' }}>
          <Sidebar isExpanded={isExpanded} />
          <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>{layout()}</Box>
        </Box>
      </Box>
    </Box>
  );
}
