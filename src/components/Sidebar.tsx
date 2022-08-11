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

import { useNavigate, useLocation } from 'react-router-dom';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import HelpIcon from '@mui/icons-material/Help';
import styles from '../styles.module.scss';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// eslint-disable-next-line
const Sidebar = (props: any) => {
  const { isExpanded } = props;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`${
        isExpanded ? 'w-64' : 'w-14'
      } will-change-width transition-width duration-300 ease-[cubic-bezier(0.2, 0, 0, 1, 0)] flex flex-col overflow-hidden z-auto order-none shadow-md`}
    >
      <div className={`${isExpanded ? 'w-64' : 'w-14 '} h-[calc(100%-4.75rem)] flex flex-col fixed`}>
        <div className="will-change-width py-6 px-0 overflow-hidden relative">
          <ul className="flex flex-col p-0 list-none overflow-hidden">
            <li
              className="flex gap-x-2 p-4 cursor-pointer items-center relative hover:bg-[#efefef]"
              data-testid="uploadFileMenu"
              onClick={() => navigate('/dashboard/create-data')}
            >
              <AddCircleOutlineIcon
                fontSize="small"
                sx={{ color: `${location.pathname === '/dashboard/create-data' ? styles.blue : styles.black}` }}
              />
              <p
                className={`${
                  !isExpanded ? 'hidden' : 'flex'
                } will-change-display transition-width duration-300 ease-[cubic-bezier(0.2, 0, 0, 1, 0)]`}
              >
                Create data
              </p>
            </li>
            <li
              className="flex gap-x-2 p-4 cursor-pointer items-center relative hover:bg-[#efefef]"
              data-testid="uploadHistoryMenu"
              onClick={() => navigate('/dashboard/history')}
            >
              <HistoryOutlinedIcon
                fontSize="small"
                sx={{ color: `${location.pathname === '/dashboard/history' ? styles.blue : styles.black}` }}
              />
              <p
                className={`${
                  !isExpanded ? 'hidden' : 'flex'
                } will-change-display transition-width duration-300 ease-[cubic-bezier(0.2, 0, 0, 1, 0)]`}
              >
                Upload history
              </p>
            </li>
            <li
              className="flex gap-x-2 p-4 cursor-pointer items-center relative hover:bg-[#efefef]"
              data-testid="helpMenu"
              onClick={() => navigate('/dashboard/help')}
            >
              <HelpIcon
                fontSize="small"
                sx={{ color: `${location.pathname === '/dashboard/help' ? styles.blue : styles.black}` }}
              />
              <p
                className={`${
                  !isExpanded ? 'hidden' : 'flex'
                } will-change-display transition-width duration-300 ease-[cubic-bezier(0.2, 0, 0, 1, 0)]`}
              >
                Help
              </p>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
