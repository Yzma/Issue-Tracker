import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Tabs = ({ activeTab, onTabClick }) => {
  return (
    <div className="flex justify-center my-8 space-x-4">
      <button
        className={`py-2 px-4 rounded bg-green-600 hover:bg-green-500 text-white ${activeTab === 'projects' ? 'bg-green-500' : ''}`}
        onClick={() => onTabClick('projects')}
      >
       <FontAwesomeIcon icon={faFolder} />  Projects
      </button>
      <button
        className={`py-2 px-4 rounded bg-green-600 hover:bg-green-500 text-white ${activeTab === 'users' ? 'bg-green-500' : ''}`}
        onClick={() => onTabClick('users')}
      >
      <FontAwesomeIcon icon={faUsers} />  Users
      </button>
      <button
        className={`py-2 px-4 rounded bg-green-600 hover:bg-green-500 text-white ${activeTab === 'settings' ? 'bg-green-500' : ''}`}
        onClick={() => onTabClick('settings')}
      >
      <FontAwesomeIcon icon={faGear} />  Settings
      </button>
    </div>
  );
};

export default Tabs;

// import React from "react";
// // import styles from '../styles/OrgPageTabs.module.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFolder } from "@fortawesome/free-solid-svg-icons";
// import { faUsers } from "@fortawesome/free-solid-svg-icons";
// import { faGear } from "@fortawesome/free-solid-svg-icons";

// const Tabs = ({ activeTab, onTabClick }) => {
//   return (
//     <div className="flex justify-center space-x-4">
//       <button
//         className={`py-2 px-4 font-semibold border border-transparent rounded ${
//           activeTab === "projects" ? "bg-green-600 text-white" : ""
//         }`}
//         onClick={() => onTabClick("projects")}
//       >
//         <FontAwesomeIcon icon={faFolder} /> Projects
//       </button>
//       <button
//         className={`py-2 px-4 font-semibold border border-transparent rounded ${
//           activeTab === "users" ? "bg-green-600 text-white" : ""
//         }`}
//         onClick={() => onTabClick("users")}
//       >
//         <FontAwesomeIcon icon={faUsers} /> Users
//       </button>
//       <button
//         className={`py-2 px-4 font-semibold border border-transparent rounded ${
//           activeTab === "settings" ? "bg-green-600 text-white" : ""
//         }`}
//         onClick={() => onTabClick("settings")}
//       >
//         <FontAwesomeIcon icon={faGear} /> Settings
//       </button>
//     </div>
//   );
// };

// export default Tabs;
