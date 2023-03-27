// import React from 'react';
// import SearchBar from './IssueSearchBar';

// const IssueButtons = ({onSearch, path}) => {
//   return (
//     <div className="grid grid-flow-col sm:auto-cols-max justify-center sm:justify-end gap-2 my-4">
//       <SearchBar onSearch={onSearch} />
//     </div>
//   );
// };

// export default IssueButtons;

import React from 'react';
import SearchBar from './IssueSearchBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router"

const IssueButtons = ({onSearch, path}) => {
  const router = useRouter()
  return (
    <div className="flex justify-between w-full items-center my-4">
      <div className="w-1/2">
        <SearchBar onSearch={onSearch} />
      </div>
      <div>
        <button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={() => router.push(`${path}/new`)}>
          <FontAwesomeIcon icon={faPlus} />
          <span > Create Issue</span>
        </button>
      </div>
    </div>
  );
};

export default IssueButtons;